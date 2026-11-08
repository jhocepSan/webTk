import { pool } from '../utils/connection.js'
import { dirname, join } from 'path'
import { Buffer } from 'buffer'
import { existsSync, unlink, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import bycript from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import {configuraciones} from '../config/config.js'
import TelegramReport from '../utils/telegramMsg.js'
const __dirname = dirname(fileURLToPath(import.meta.url));

cloudinary.config({
    cloud_name: configuraciones.CLOUDINARY_CLOUD_NAME,
    api_key: configuraciones.CLOUDINARY_API_KEY,
    api_secret: configuraciones.CLOUDINARY_API_SECRET
});

export const getUsuarios = async () => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT idusuario,correo,nombres,apellidos,idclub,idcinturon,ci,estado,tipo,albitro,(select ruta from adjunto where idadjunto=foto)as foto,tipoalbitro, ' +
            '(select nombre from club where idclub=us.idclub)as club,(select nombre from cinturon where idcinturon=us.idcinturon)as cinturon FROM usuario us where us.estado!="E";')
        return { "ok": result }
    } catch (error) {
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getUsuarioClasificado = async (info) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT idusuario,correo,nombres,apellidos,idclub,idcinturon,ci,estado,tipo,albitro,(select ruta from adjunto where idadjunto=foto)as foto,tipoalbitro, ' +
            '(select nombre from club where idclub=us.idclub)as club,(select nombre from cinturon where idcinturon=us.idcinturon)as cinturon FROM usuario us where us.estado=?;', [info.estado])
        return { "ok": result }
    } catch (error) {
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const recuperarContrasenia=async(info)=>{
    var conn;
    try {
        var anio = new Date().getFullYear();
        conn = await pool.getConnection();
        const [result] = await conn.query("select password from usuario where idusuario=?;",[info.idusuario])    
        const nuevoPasswordPlano = "NuevaClave"+anio;
        const nuevoHash = await bycript.hash(nuevoPasswordPlano, 10);
        await conn.query("update usuario set password=? where idusuario=?;",[nuevoHash,info.idusuario])
        console.log(result);
        return { "ok": nuevoPasswordPlano }
    } catch (error) {
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getAlbitros = async (info) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(`SELECT idusuario,nombres FROM tkdb.usuario 
            WHERE estado!='E' AND albitro='A' AND tipoalbitro=?`, [info.tipo])
        return { "ok": result }
    } catch (error) {
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const cambiarEstadoAlbitro = async (info) => {
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query('UPDATE usuario SET albitro=? WHERE idusuario=?;',
            [info.estado, info.idusuario])
        await conn.query('UPDATE mandopunto SET estado=? WHERE idusuario=?;',
            [info.estado, info.idusuario])
        await conn.commit();
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const cambiarTipoDeAlbitro = async (info) => {
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query('UPDATE usuario SET tipoalbitro=? WHERE idusuario=?;',
            [info.tipoAlbitro, info.idusuario])
        await conn.query('UPDATE mandopunto SET tipoalbitro=? WHERE idusuario=?;',
            [info.tipoAlbitro, info.idusuario])
        await conn.commit();
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const cambiarEstadoUsuario = async (info) => {
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query('UPDATE usuario SET estado=? WHERE idusuario=?;',
            [info.estado, info.idusuario])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const updateUsuarioImg = async (info) => {
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query('UPDATE usuario SET foto=? WHERE idusuario=?;',
            [info.idImg, info.usuario])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
/*
export const cargarAdjunto = async (data) => {
    var sql = "INSERT INTO adjunto (tipo,ruta) values (?,?) ;"
    var conn;
    try {
        var fecha = new Date().getTime();
        var info = data.name.split('.');
        conn = await pool.getConnection();
        var [result] = await conn.execute(sql, ['IMG', 'ADJUNTO_' + fecha + '_' + info[3] + '.' + info[1]]);
        if (result.affectedRows != 0) {
            var nameImg = 'ADJUNTO_' + fecha + '_' + info[3] + '.' + info[1];
            var rutaImg = join(__dirname, '../public/') + nameImg;
            console.log(rutaImg);
            if (existsSync(rutaImg) == false) {
                var imagen = Buffer.from(data.data);
                imagen = imagen.toString('base64');
                writeFileSync(rutaImg, imagen, 'base64');
                await conn.commit();
                return { "ok": result.insertId, "url": nameImg }
            } else {
                await conn.rollback()
                unlink(rutaImg, function (err) {
                    if (err) return console.log(err);
                    console.log(rutaImg, 'Archivo Eliminado');
                });
                return { "error": "intente Nuevamente" }
            }
        } else {
            await conn.rollback()
            return { "error": "intente Nuevamente" }
        }
    } catch (error) {
        await conn.rollback()
        console.log("error guardarFoto ", error);
        return { "error": error.message }
    } finally {
        if (conn) {
            await conn.close();
        }
    }
}*/

export const cargarAdjunto = async (data) => {
    var sql = "INSERT INTO adjunto (tipo, ruta) values (?, ?) ;"
    var conn;
    try {
        conn = await pool.getConnection();
        
        // 1. Convertimos el Buffer directo a un string DataURI base64 legible por Cloudinary
        const base64Image = Buffer.from(data.data).toString('base64');
        const dataURI = `data:${data.mimetype || 'image/png'};base64,${base64Image}`;

        // 2. Subimos usando la función clásica con parámetros de timeout extendidos
        const uploadToCloudinary = () => {
            return cloudinary.uploader.upload(dataURI, {
                folder: "campeonatos_adjuntos",
                resource_type: "image",
                // Forzamos credenciales
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                // Ajustes para conexiones lentas (Aumentamos el tiempo de espera)
                timeout: 60000,          // 60 segundos máximos de espera
                connection_timeout: 30000 // 30 segundos para conectar
            });
        };

        // 3. Ejecutamos la subida
        const cloudinaryResult = await uploadToCloudinary();
        const urlInCloudinary = cloudinaryResult.secure_url;

        // 4. Insertamos en la Base de Datos
        var [result] = await conn.execute(sql, ['IMG', urlInCloudinary]);
        
        if (result.affectedRows != 0) {
            await conn.commit();
            return { "ok": result.insertId, "url": urlInCloudinary };
        } else {
            await conn.rollback();
            return { "error": "Intente Nuevamente" };
        }

    } catch (error) {
        if (conn) await conn.rollback();
        console.log("error guardarFoto Cloudinary: ", error);
        return { "error": error.message };
    } finally {
        if (conn) {
            await conn.close();
        }
    }
}

