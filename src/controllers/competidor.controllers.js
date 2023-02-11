import { pool } from '../utils/connection.js'

export const addEditCompetidor = async (info) => {
    var conn;
    try {
        conn = await pool.getConnection();
        if (info.idCompetidor === 0) {
            const [result] = await conn.query('INSERT INTO tkdb.competidor (nombres,apellidos,fecha,edad,peso,ci,idclub,idcinturon,idcampeonato,tipo,idgrado,genero,altura) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);',
                [info.nombres, info.apellidos, info.fecha, info.edad, info.peso, info.ciUser, info.idClub, info.cinturon, info.idCampeonato, info.tipos, info.idGrado,info.genero,info.altura])
            return { "ok": "GUARDADO" }
        } else {
            const [result] = await conn.query('UPDATE tkdb.competidor SET nombres=?,apellidos=?,fecha=?,edad=?,peso=?,ci=?,idclub=?,idcinturon=?,idcampeonato=?,tipo=?,idgrado=?,genero=?,altura=? WHERE idcompetidor=?;',
                [info.nombres, info.apellidos, info.fecha, info.edad, info.peso, info.ciUser, info.idClub, info.cinturon, info.idCampeonato, info.tipos, info.idGrado,info.genero,info.altura,info.idCompetidor])
            return { "ok": "ACTUALIZANDO" }
        }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getCompetidores = async (info) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT *,(select nombre from tkdb.club where idclub=c.idclub) as club,(select nombre from tkdb.cinturon where idcinturon=c.idcinturon) as cinturon FROM tkdb.competidor c WHERE c.idcampeonato=? and c.idclub=? and c.tipo=? and c.genero=? and c.estado!="E";',
            [ info.idCampeonato,info.club, info.tipo,info.genero])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const deleteCompetidor=async(info)=>{
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query('UPDATE tkdb.competidor SET estado=? WHERE idcompetidor=?;',
            [ info.estado,info.idcompetidor])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const getCompetidorClasificado=async(info)=>{
    var sql='SELECT *,(select nombre from tkdb.club where idclub=c.idclub) as club, '+
        '(select nombre from tkdb.cinturon where idcinturon=c.idcinturon) as cinturon, '+
        '(SELECT gr.nombre FROM tkdb.grado gr inner join tkdb.cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado, '+
        '(select cate.idcategoria from tkdb.categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin '+
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as idcategoria, '+
        '(select cate.nombre from tkdb.categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin '+
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as nombrecategoria, '+
        '(select subcate.idsubcategoria from tkdb.categoria cate inner join tkdb.subcategoria subcate on subcate.idcategoria=cate.idcategoria '+
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as idsubcategoria, '+
        '(select subcate.nombre from tkdb.categoria cate inner join tkdb.subcategoria subcate on subcate.idcategoria=cate.idcategoria '+
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as nombresubcategoria '+
        'FROM tkdb.competidor c WHERE c.idcampeonato=? and c.tipo=? and c.genero=? and c.estado="A";'
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql,
            [ info.idCampeonato, info.tipo,info.genero])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}