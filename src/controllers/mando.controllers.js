import {pool} from '../utils/connection.js'

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