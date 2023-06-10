import { pool } from '../utils/connection.js'
import bycript from 'bcrypt';

export const agregarUsuario = async ({ info }) => {
    console.log(info);
    var conn;
    try {
        var newPassword = bycript.hashSync(info.password, 10);
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT idusuario from usuario where correo=?', [info.correo])
        if (result.length === 0) {
            const [rows] = await conn.query('INSERT INTO usuario (correo,password,nombres,apellidos,idclub,ci) values (?,?,?,?,?,?)', [
                info.correo, newPassword, info.nombres, info.apellidos, info.idClub, info.ciUser
            ]);
            return {
                "ok": {
                    id: rows.insertId,
                    correo: info.correo,
                    nombres: info.nombres,
                    apellido: info.apellidos,
                    idclub: info.idClub
                }
            }
        } else {
            return { "error": "Correo Existente" }
        }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const iniciarSession = async ({ correo, password }) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('select * from usuario where correo=?', [correo.replace(' ', '')])
        console.log(result)
        if (result.length !== 0) {
            if (bycript.compareSync(password.replace(' ', ''), result[0].password)) {
                return {
                    "ok": {
                        id: result[0].idusuario,
                        correo: result[0].correo,
                        nombres: result[0].nombres,
                        apellido: result[0].apellidos,
                        idclub: result[0].idclub,
                        tipo: result[0].estado
                    }
                }
            }
        }
        return { "error": "Usuario o Contraseña No Validos" }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const crearCampeonato = async (info) => {
    var conn;
    try {
        var buf = Buffer.from(info.descripcion);
        conn = await pool.getConnection();
        const [result] = await conn.query('select * from campeonato where nombre=?', [info.nombre])
        if (result.length === 0) {
            const [rows] = await conn.query('insert into campeonato(nombre,descripcion) values(?,?)', [info.nombre, buf])
            if (info.importCat) {
                const [categorias] = await conn.query('SELECT * FROM categoria where estado="A" and idcampeonato=? order by edadini;',
                    [info.importId]);
                for (var cat of categorias){
                    cat.idcampeonato=rows.insertId
                    var [newCat]=await conn.query('INSERT INTO categoria (nombre,edadini,edadfin,idcampeonato,genero) value (?,?,?,?,?);',
                    [cat.nombre,cat.edadini,cat.edadfin,cat.idcampeonato,cat.genero])
                    const [subCat] = await conn.query('SELECT * FROM subcategoria where idcategoria=? order by pesoini;', [cat.idcategoria])
                    for(var sbcat of subCat){
                        await conn.query('INSERT INTO subcategoria (idcategoria,nombre,pesoini,pesofin) value (?,?,?,?);',
                        [newCat.insertId,sbcat.nombre,sbcat.pesoini,sbcat.pesofin])
                    }
                }
            }
            if (info.importGrad) {
                const [grados] = await conn.query('SELECT idgrado,nombre,tipo FROM grado where estado="A" and idcampeonato=? ;',[info.importId]);
                console.log(grados);
                for (var grad of grados){
                    const [newGrad] = await conn.query('INSERT INTO grado (nombre,tipo,idcampeonato) values (?,?,?);',[grad.nombre,grad.tipo,rows.insertId]);
                    const [cinturones] = await conn.query('SELECT idcinturon,nombre FROM cinturon where idgrado=? ;',[grad.idgrado]);
                    for (var grd of cinturones){
                        const [result] = await conn.query('INSERT INTO cinturon (nombre,idgrado) values (?,?);',[grd.nombre,newGrad.insertId]);
                    }
                }
            }
            await conn.commit()
            return {
                "ok": {
                    id: rows.insertId
                }
            }
        }
        return { "error": "El nombre del campeonato ya existe ." }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const recuperarCuenta = async (info) => {
    var conn;
    try {
        var newPassword = bycript.hashSync(info.newPassword, 10);
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT idusuario from usuario where correo=? and ci=? and estado!="E"', [info.email, info.ci])
        console.log(result)
        if (result.length !== 0) {
            const [rows] = await conn.query('UPDATE usuario SET password=? WHERE idusuario=? and estado!="E"', [
                newPassword, result[0].idusuario
            ]);
            return { "ok": "Ingresa al sistemas con su nuevos datos, por favor ..." }
        } else {
            return { "error": "El correo o el ci, no existe en la cuenta, verifique por favor !!" }
        }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}