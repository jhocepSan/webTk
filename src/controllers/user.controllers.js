import { pool } from '../utils/connection.js'

export const getUsuarios = async () => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT *,(select nombre from club where idclub=us.idclub)as club,(select nombre from cinturon where idcinturon=us.idcinturon)as cinturon FROM usuario us where us.estado!="E";')
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