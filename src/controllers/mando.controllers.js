import {pool} from '../utils/connection.js'

export const setInfoMando=async(info)=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('UPDATE mandopunto SET dato=?,sector=? WHERE idusuario=? and estado="A" ;',[info.dato,info.sector,info.id])
        await conn.commit();
        return {"ok":"ok"}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}

export const sendDatosPoomse=async(info)=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('UPDATE mandopunto SET poomseaccuracy=?,poomsepresentation=?,sector=? WHERE idusuario=? and estado="A" ;',[info.ACCURACY,info.PRESENTATION,info.sector,info.id])
        await conn.commit();
        return {"ok":"ok"}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}

export const getPuntosMando=async(info)=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('SELECT * FROM mandopunto WHERE sector=? and estado="A";',[info.sector])
        await conn.query('UPDATE mandopunto SET dato="" WHERE sector=?;',[info.sector])
        console.log(result);
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}