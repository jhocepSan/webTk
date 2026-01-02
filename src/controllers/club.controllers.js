import {pool} from '../utils/connection.js'

export const getListaClub = async ()=>{
    var conn;
    const sql =`select c.idclub,c.nombre,c.abreviado,ubi.direccion,
        c.telefono,c.estado,c.puntuado,c.idadjunto,
        c.idubicacion,ubi.latitud,ubi.longitud,
        CASE c.estado
            WHEN 'A' THEN 'Activo'
        WHEN 'E' THEN 'Eliminado'
        WHEN 'I' THEN 'Inactivo'
        WHEN 'P' THEN 'Procesado'
        ELSE 'Desconocido'
        END AS name_estado,
        CASE c.puntuado
            WHEN 'A' THEN 'Puntuable'
        WHEN 'I' THEN 'No Puntuable'
        ELSE 'Desconocido'
        END AS name_puntuado,
        (select ruta from adjunto where idadjunto=c.idadjunto)as imagen 
        from club c left join ubicacion ubi 
        on ubi.idubicacion=c.idubicacion
        where c.estado="A";`
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query(sql)
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}

export const getListaClubPuntuado = async ()=>{
    var sql = `select c.idclub,c.nombre,c.abreviado,ubi.direccion,
        c.telefono,c.estado,c.puntuado,c.idadjunto,
        c.idubicacion,ubi.latitud,ubi.longitud,
        CASE c.estado
            WHEN 'A' THEN 'Activo'
        WHEN 'E' THEN 'Eliminado'
        WHEN 'I' THEN 'Inactivo'
        WHEN 'P' THEN 'Procesado'
        ELSE 'Desconocido'
        END AS name_estado,
        CASE c.puntuado
            WHEN 'A' THEN 'Puntuable'
        WHEN 'I' THEN 'No Puntuable'
        ELSE 'Desconocido'
        END AS name_puntuado,
        (select ruta from adjunto where idadjunto=c.idadjunto)as imagen 
        from club c left join ubicacion ubi 
        on ubi.idubicacion=c.idubicacion
        where c.estado="A" and c.puntuado="A" order by c.nombre;`
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query(sql)
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}

export const addClub = async ({info})=>{
    console.log(info);
    var conn;
    try {
        var buf = Buffer.from(info.direccion);
        conn =await pool.getConnection();
        const [result] = await conn.query('insert into club (nombre,abreviado,direccion,telefono) value (?,?,?,?)',[
            info.nombre,info.nombreAbr,buf,info.telefono
        ])
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}

export const deleteClub = async ({info})=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('update club set estado="E" where idclub=?;',info.idclub)
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}
export const editarClub = async ({info})=>{
    var conn;
    try {
        var buf = Buffer.from(info.direccion);
        conn =await pool.getConnection();
        const [result] = await conn.query('update club set nombre=?,abreviado=?,direccion=?,telefono=? where idclub=?;',
        [info.nombre,info.nombreAbr,buf,info.telefono,info.idClub]);
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}

export const setPuntuadoClub = async (info)=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('update club set puntuado=? where idclub=?;',[info.puntuado,info.idclub])
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}
export const updateClubImg = async(info)=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('update club set idadjunto=? where idclub=?;',[info.idImg,info.club])
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}