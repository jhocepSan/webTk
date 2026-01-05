import { pool } from '../utils/connection.js'

export const getEstudiantes = async (info) => {
    var conn;
    const sql = `select estu.idestudi,estu.iddato,estu.idcinturon,estu.idclub,estu.estado,
        case estu.estado when 'A' THEN 'Activo'
        when 'I' THEN 'Inactivo'
        when 'E' THEN 'Eliminado'
        when 'B' THEN 'Baja Medica'
        when 'L' THEN 'Licencia'
        else 'Otro' end as name_estado,estu.idperiodo,dat.nombres,dat.apellidos,
        DATE_FORMAT(dat.fecha_nac, '%Y-%m-%d') as fecha_nac,dat.genero,
        case dat.genero when 'F' THEN 'Femenino' when 'M' THEN 'Masculino'
        else 'Otro' end as name_genero,dat.ci,dat.celular,dat.idubicacion,
        TIMESTAMPDIFF(YEAR, dat.fecha_nac, CURDATE()) AS edad,
        clb.nombre as name_club,ubi.direccion,cint.nombre as name_cinturon,
        cint.colores,adj.ruta as imagen,hor.dia,per.hora_ini,per.hora_fin,
        CONCAT(datd.nombres, ' ', datd.apellidos) as nombre_docente,
        ubi.latitud,ubi.longitud,adj.idadjunto
        from estudiante estu inner join datos dat on estu.iddato=dat.idato
        left join club clb on clb.idclub=estu.idclub
        left join cinturones cint on cint.idcinturon=estu.idcinturon
        left join adjunto adj on adj.idadjunto=dat.idadjunto
        left join periodo per on per.idperiodo=estu.idperiodo
        left join ubicacion ubi on ubi.idubicacion=dat.idubicacion
        left join docente doc on doc.iddocente =per.iddocente
        left join datos datd on datd.idato=doc.iddato
        left join horario hor on hor.idhorario=per.idhorario
        where estu.idclub=? and (dat.genero=? || ?='A')
        and estu.estado!='E' and (?=0 || estu.idperiodo=?);`
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.idclub, info.genero, info.genero, info.idperiodo, info.idperiodo]);
        return { 'ok': result }
    } catch (error) {
        console.log(error)
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const addEstudiante = async (info) => {
    var conn;
    const sql = `insert into datos (nombres,apellidos,fecha_nac,genero,ci,celular,idubicacion,idadjunto) values (?,?,?,?,?,?,?,?);`;
    const sql2 = `insert into estudiante(iddato,idcinturon,idclub,idperiodo) values (?,?,?,?);`;
    const sql3 = `update ubicacion set latitud=?,longitud=?,direccion=? where idubicacion=?;`;
    const sql4 = `update datos set nombres=?,apellidos=?,fecha_nac=?,genero=?,ci=?,celular=?,idubicacion=?,idadjunto=? where idato=?`;
    const sql5 = `update estudiante set iddato=?,idcinturon=?,idclub=?,idperiodo=? where idestudi=?`;
    const sql6 = `update periodo set cant_alumnos=(
        select IFNULL(COUNT(*), 0) as cantidad_alumnos 
        from estudiante 
        where idclub=? and idperiodo=1)
        where idperiodo=1;`
    try {
        console.log(info);
        conn = await pool.getConnection();
        await conn.beginTransaction();
        if (info.idestudi == 0 || !info.idestudi) {
            const [result] = await conn.query(sql, [info.nombres, info.apellidos, info.fecha_nac, info.genero,
            info.ci, info.celular, info.idubicacion == 0 ? null : info.idubicacion, info.idadjunto == 0 ? null : info.idadjunto
            ]);
            await conn.query(sql2, [result.insertId, info.idcinturon, info.idclub, info.idperiodo == 0 ? null : info.idperiodo])
        } else {
            await conn.query(sql4, [info.nombres, info.apellidos, info.fecha_nac, info.genero,
            info.ci, info.celular, info.idubicacion == 0 ? null : info.idubicacion,
            info.idadjunto == 0 ? null : info.idadjunto, info.iddato]);
            await conn.query(sql5, [info.iddato, info.idcinturon, info.idclub, info.idperiodo == 0 ? null : info.idperiodo, info.idestudi])
        }
        if (info.idubicacion != 0) {
            await conn.query(sql3, [info.latitud, info.longitud, info.direccion, info.idubicacion])
        }
        await conn.commit()
        return { 'ok': 'result' }
    } catch (error) {
        if (conn) await conn.rollback();
        console.log(error)
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const editEstadoEstu = async (info) => {
    var conn;
    const sql = `update estudiante set estado=? where idestudi=?;`
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const [result] = await conn.query(sql, [info.estado, info.id]);
        await conn.commit()
        return { 'ok': result }
    } catch (error) {
        if (conn) await conn.rollback();
        console.log(error)
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getAsisEstudi = async (info) => {
    var conn;
    const sql = `delete from asistencia where fecha_real=CURDATE()
        AND presente ='2' and idperiodo=?
        and idestudi in(select estu.idestudi from estudiante estu where estu.estado!='A' and estu.idclub=? );`
    const sql1 = `insert ignore into asistencia (idestudi,idperiodo,presente,fecha_real)
        select estu.idestudi,estu.idperiodo,'2' as presente,
        CURDATE() as fecha_real
        from estudiante estu inner join periodo per on per.idperiodo=estu.idperiodo
        where estu.idperiodo=? and estu.idclub=? and estu.estado='A'`
    const sql2 = `SELECT estu.idestudi, estu.iddato, estu.idcinturon, estu.idclub,
        estu.idperiodo, dat.nombres, dat.apellidos,
        case estu.estado when 'A' THEN 'Activo'
        when 'I' THEN 'Inactivo'
        when 'E' THEN 'Eliminado'
        when 'B' THEN 'Baja Medica'
        when 'L' THEN 'Licencia'
        else 'Otro' end as name_estado,
        DATE_FORMAT(dat.fecha_nac, '%Y-%m-%d') as fecha_nac, dat.genero,
        CASE dat.genero WHEN 'F' THEN 'Femenino' WHEN 'M' THEN 'Masculino' ELSE 'Otro' END AS name_genero,
        dat.ci, dat.celular, dat.idubicacion,
        TIMESTAMPDIFF(YEAR, dat.fecha_nac, CURDATE()) AS edad,
        clb.nombre as name_club, ubi.direccion, cint.nombre as name_cinturon,
        cint.colores, adj.ruta as imagen, hor.dia, per.hora_ini, per.hora_fin,
        CONCAT(datd.nombres, ' ', datd.apellidos) as nombre_docente,
        ubi.latitud, ubi.longitud, adj.idadjunto, ast.presente,ast.idasistencia,
        CASE ast.presente 
            WHEN 1 THEN 'Asistió'
            WHEN 2 THEN 'Faltó'
            WHEN 3 THEN 'Enfermo'
            WHEN 4 THEN 'Permiso'
            ELSE '--' END AS estado_presente
        FROM estudiante estu 
        INNER JOIN datos dat ON estu.iddato = dat.idato
        LEFT JOIN club clb ON clb.idclub = estu.idclub
        LEFT JOIN cinturones cint ON cint.idcinturon = estu.idcinturon
        LEFT JOIN adjunto adj ON adj.idadjunto = dat.idadjunto
        LEFT JOIN periodo per ON per.idperiodo = estu.idperiodo
        LEFT JOIN ubicacion ubi ON ubi.idubicacion = dat.idubicacion
        LEFT JOIN docente doc ON doc.iddocente = per.iddocente
        LEFT JOIN datos datd ON datd.idato = doc.iddato
        LEFT JOIN horario hor ON hor.idhorario = per.idhorario
        LEFT JOIN asistencia ast ON ast.idestudi = estu.idestudi 
            AND ast.fecha_real = ? 
        WHERE (estu.idperiodo = ? OR ast.idperiodo = ?) AND estu.idclub = ? 
        and (ast.idasistencia IS NOT NULL OR estu.estado = 'A');`
    try {
        console.log(info);
        conn = await pool.getConnection();
        let fecha_hoy = new Date().toISOString().split('T')[0];
        if (info.fecha == fecha_hoy) {
            await conn.beginTransaction();
            await conn.query(sql, [info.idperiodo, info.idclub]);
            await conn.query(sql1, [info.idperiodo, info.idclub]);
            await conn.commit()
        }
        const [result] = await conn.query(sql2, [info.fecha, info.idperiodo, info.idperiodo, info.idclub]);

        return { 'ok': result }
    } catch (error) {
        if (conn) await conn.rollback();
        console.log(error)
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const setAsistencia = async (info) => {
    var conn;
    const sql = `update asistencia set presente=? where idasistencia=?`
    try {
        console.log(info);
        conn = await pool.getConnection();

        await conn.beginTransaction();
        await conn.query(sql, [info.presente, info.idasistencia]);
        await conn.commit()

        return { 'ok': "Modificación correcta" }
    } catch (error) {
        if (conn) await conn.rollback();
        console.log(error)
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}