import { pool } from '../utils/connection.js'
import {dirname, join} from 'path'
import {Buffer} from 'buffer'
import {existsSync,unlink,writeFileSync} from 'fs'
import {fileURLToPath} from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url));

export const getUsuarios = async () => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT idusuario,correo,nombres,apellidos,idclub,idcinturon,ci,estado,tipo,albitro,(select ruta from adjunto where idadjunto=foto)as foto,tipoalbitro, '+
            '(select nombre from club where idclub=us.idclub)as club,(select nombre from cinturon where idcinturon=us.idcinturon)as cinturon FROM usuario us where us.estado!="E";')
        return { "ok": result }
    } catch (error) {
        console.log(error);
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
export const updateUsuarioImg=async(info)=>{
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

export const cargarAdjunto = async (data)=>{
    var sql = "INSERT INTO adjunto (tipo,ruta) values (?,?) ;"
    var conn;
    try {
        var fecha = new Date().getTime();
        var info = data.name.split('.');
        conn = await pool.getConnection();
        var [result] = await conn.execute(sql,['IMG','ADJUNTO_'+fecha+'_'+info[3]+'.'+info[1]]);
        if(result.affectedRows!=0){
            var nameImg = 'ADJUNTO_'+fecha+'_'+info[3]+'.'+info[1];
            var rutaImg = join(__dirname,'../public/') + nameImg;
            console.log(rutaImg);
            if (existsSync(rutaImg) == false) {
                var imagen = Buffer.from(data.data);
                imagen = imagen.toString('base64');
                writeFileSync(rutaImg, imagen, 'base64');
                await conn.commit();
                return {"ok":result.insertId}
            }else{
                await conn.rollback()
                unlink(rutaImg,function(err){
                    if(err) return console.log(err);
                    console.log(rutaImg,'Archivo Eliminado');
                });
                return {"error":"intente Nuevamente"}    
            }
        }else{
            await conn.rollback()
            return {"error":"intente Nuevamente"}
        }
    } catch (error) {
        await conn.rollback()
        console.log("error guardarFoto ", error);
        return {"error":error.message}
    }finally {
        if (conn) {
            await conn.close();
        }
    }
}