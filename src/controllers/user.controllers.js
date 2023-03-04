import {pool} from '../utils/connection.js'

export const getUsuarios = async ()=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('SELECT idusuario,nombres,apellidos,ci,correo,foto,idcinturon,idclub FROM usuario where estado="A";')
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}