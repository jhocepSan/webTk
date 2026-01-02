import { pool } from '../utils/connection.js'

export const getDocentes = async (info) => {
    const sql = `SELECT 
            doc.*,
            case doc.estado 
                when 'A' THEN 'Activo'
            when 'I' THEN 'Inactivo'
            when 'E' THEN 'Eliminado'
            when 'B' THEN 'Baja Medica'
            when 'P' THEN 'Practicante'
            else 'Otro' 
            end as name_estado,
            dat.nombres,dat.apellidos,
            dat.fecha_nac,dat.genero,
            case dat.genero 
                when 'F' THEN 'Femenino'
            when 'M' THEN 'Masculino'
            else 'Otro' 
            end as name_genero,dat.ci,
            dat.celular,
            TIMESTAMPDIFF(YEAR, dat.fecha_nac, CURDATE()) AS edad,
            c.nombre AS name_club,
            adj.ruta AS imagen,
            dat.idubicacion,
            ubi.latitud, 
            ubi.longitud, 
            ubi.direccion,
            cint.nombre as cinturon,
            cint.colores
        FROM docente doc
        INNER JOIN club c ON doc.idclub = c.idclub
        INNER JOIN datos dat ON doc.iddato = dat.idato
        LEFT JOIN adjunto adj ON dat.idadjunto = adj.idadjunto
        LEFT JOIN ubicacion ubi ON dat.idubicacion = ubi.idubicacion
        LEFT JOIN cinturones cint on doc.idcinturon = cint.idcinturon
        WHERE doc.idclub = ? and doc.estado!='E';
        `
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql,[info.idclub])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const agregarDocente=async(info)=>{
    const sql = 'insert into datos (nombres,apellidos,fecha_nac,genero,ci,celular,idubicacion,idadjunto) values (?,?,?,?,?,?,?,?);'
    const sql1 = 'update ubicacion set latitud=?,longitud=?,direccion=? where idubicacion=?;'
    const sql2 = 'insert into docente(iddato,idclub,idcinturon,especialidad) values (?,?,?,?);'
    const sql3 = 'update datos set nombre=?,apellidos=?,fecha_nac=?,genero=?,ci=?,celular=?,idubicacion=?,idadjunto=? where idato=?'
    const sql4 = 'update docente set iddato=?,idclub=?,idcinturon=?,especialidad=? where iddocente=?'
    var conn;
    try {
        conn = await pool.getConnection();
        if (info.iddocente===0 || !info.iddocente){
            const [resDato] = await conn.query(sql,[info.nombres,info.apellidos,info.fecha_nac,info.genero,
                info.ci,info.celular,info.idubicacion,info.idadjunto]);
            if (resDato.insertId!=0){
                const newIdDato = resDato.insertId;
                await conn.query(sql1,[info.latitud,info.longitud,info.direccion,info.idubicacion])
                await conn.query(sql2,[newIdDato,info.idclub,info.idcinturon,info.especialidad])
            }
        }else{
            await conn.query(sql3,[info.nombres,info.apellidos,info.fecha_nac,info.genero,
                info.ci,info.celular,info.idubicacion,info.idadjunto,info.iddato])
            await conn.query(sql1,[info.latitud,info.longitud,info.direccion,info.idubicacion])
            await conn.query(sql4,[info.iddato,info.idclub,info.idcinturon,info.especialidad,info.iddocente])
        }
        await conn.commit()
        return { "ok": "Registrado Correctamente" }
    } catch (error) {
        if (conn) await conn.rollback();
        console.log(error)
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}