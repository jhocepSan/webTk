import { pool } from '../utils/connection.js'

export const getPuntosMando = async (info) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT * FROM mandopunto WHERE sector=? and estado="A" and tipoalbitro="C" order by id;', [info.sector]);
        //await conn.query('UPDATE mandopunto SET dato="" WHERE sector=?;',[info.sector])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getPuntosPoomse = async (info) => {
    var sql = `SELECT m.*,us.nombres,ad.ruta FROM mandopunto m 
        left join usuario us on m.idusuario=us.idusuario
        left join adjunto ad on ad.idadjunto=us.foto
        WHERE m.sector=? and m.estado="A" and m.tipoalbitro="P" and m.poomseaccuracy!=0 order by id;`
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.sector]);
        //await conn.query('UPDATE mandopunto SET dato="" WHERE sector=?;',[info.sector])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const limpiarLecturas = async (info) => {
    var conn;
    try {
        conn = await pool.getConnection();
        await conn.query('UPDATE mandopunto SET dato="" WHERE sector=? and tipoalbitro="C";', [info.sector])
        await conn.commit();
        return { "ok": "ok" }
    } catch (error) {
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const limpiarLecturasPoomse = async (info) => {
    var conn;
    try {
        conn = await pool.getConnection();
        await conn.query('UPDATE mandopunto SET poomseaccuracy=0,poomsepresentation=0 WHERE sector=? and tipoalbitro="P";', [info.sector])
        await conn.commit();
        return { "ok": "ok" }
    } catch (error) {
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const setPuntuacionPoomse = async (info) => {
    var conn;
    try {
        conn = await pool.getConnection();
        await conn.query('UPDATE clasificacion SET puntuacion=? where idclasificacion=?;', [info.puntuacion,info.idclasificacion])
        await conn.commit();
        return { "ok": "ok" }
    } catch (error) {
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}