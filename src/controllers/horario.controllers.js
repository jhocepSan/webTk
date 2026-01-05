import { pool } from '../utils/connection.js'

export const getHorarios = async (info) => {
    var conn;
    const sql = `select hr.idhorario,hr.idclub,hr.turno,hr.dia,
        per.idperiodo,per.iddocente,per.limite_alumnos,
        per.cant_alumnos,per.descripcion,per.activo,
        TIME_FORMAT(per.hora_ini, '%H:%i') AS hora_ini,
        TIME_FORMAT(per.hora_fin, '%H:%i') AS hora_fin,
        CONCAT(datt.nombres, ' ', datt.apellidos) as nombre_docente
        from horario hr 
        inner join periodo per on per.idhorario=hr.idhorario
		left join docente doc on doc.iddocente=per.iddocente
        left join datos datt on datt.idato=doc.iddato
        where hr.idclub=? and hr.dia=? and per.activo=1;`
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.idclub, info.dia]);
        return { 'ok': result }
    } catch (error) {
        console.log(error)
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const agregarHorario = async (info) => {
    var conn;
    const cont = `select IFNULL(COUNT(*), 0) as cantidad_alumnos 
        from estudiante 
        where idclub=? and idperiodo=?;`
    const sql = `insert into horario (idclub,dia) values(?,?);`
    const sql2 = `insert into periodo (idhorario,iddocente,limite_alumnos,cant_alumnos,descripcion,hora_ini,hora_fin) values (?,?,?,?,?,?,?);`
    const sql3 = `update horario set idclub=?,dia=? where idhorario=?;`
    const sql4 = `update periodo set idhorario=?,iddocente=?,limite_alumnos=?,cant_alumnos=?,descripcion=?,hora_ini=?,hora_fin=? where idperiodo=?;`
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query(cont, [info.idclub, info.idperiodo]);
        console.log(result)
        let num_alumn = result[0].cantidad_alumnos;
        if (info.idhorario==0 || !info.idhorario){
            const [resulhora] = await conn.query(sql,[info.idclub,info.dia]);
            await conn.query(sql2,[resulhora.insertId,info.iddocente,info.limite_alumnos,
                num_alumn,info.descripcion,info.hora_ini,info.hora_fin]);
        }else{
            await conn.query(sql3,[info.idclub,info.dia,info.idhorario]);
            await conn.query(sql4,[info.idhorario,info.iddocente,info.limite_alumnos,
                num_alumn,info.descripcion,info.hora_ini,info.hora_fin,info.idperiodo
            ])
        }
        await conn.commit()
        return { 'ok': 'Agregado Correctamente' }
    } catch (error) {
        if (conn) await conn.rollback();
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}