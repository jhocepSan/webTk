import { pool } from '../utils/connection.js'

export const guardarRompimientoPuntos = async (info) => {
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        var datoOrdenado = info.competidores.sort((a, b) => b.rompio - a.rompio);
        var position = 1;
        for await (var cmp of datoOrdenado) {
            var punt = parseFloat(cmp.rompio) + parseFloat(cmp.norompio);
            const [result] = await conn.query("UPDATE clasificacion set estado='C',posicion=?,puntuacion=?,rompio=?,norompio=? where idclasificacion=? ;",
                [position, punt.toFixed(1), parseFloat(cmp.rompio), parseFloat(cmp.norompio), cmp.idclasificacion])
            position += 1;
            await conn.commit()
        }
        return { 'ok': 'Guardado la Puntuación' }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const addEditCompetidor = async (info) => {
    var conn;
    try {
        conn = await pool.getConnection();
        var tipoComt = null;
        if (info.listaCTipoC.length !== 0) {
            tipoComt = info.listaCTipoC.map((item) => item.idtipo).join(':');
        }
        if (parseInt(info.idCompetidor) === 0) {
            const [result] = await conn.query(`INSERT INTO competidor (nombres,apellidos,fecha,edad,peso,ci,
                idclub,idcinturon,idcampeonato,tipo,idgrado,genero,altura,idtipocompetencia,idadjunto) 
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
                [info.nombres, info.apellidos, info.fecha, info.edad, info.peso, info.ciUser, info.idClub, info.cinturon, info.idCampeonato, info.tipos, info.idGrado, info.genero, info.altura, tipoComt,info.idAdjunto])
            await conn.commit()
            return { "ok": "GUARDADO" }
        } else {
            const [result] = await conn.query(`UPDATE competidor SET nombres=?,apellidos=?,fecha=?,
                edad=?,peso=?,ci=?,idclub=?,idcinturon=?,idcampeonato=?,tipo=?,idgrado=?,genero=?,altura=?,
                idtipocompetencia=?,idadjunto=? WHERE idcompetidor=?;`,
                [info.nombres, info.apellidos, info.fecha, info.edad, info.peso, info.ciUser, 
                info.idClub, info.cinturon, info.idCampeonato, info.tipos, info.idGrado, info.genero,
                 info.altura, tipoComt,info.idAdjunto,info.idCompetidor])
            await conn.commit()
            return { "ok": "ACTUALIZANDO" }
        }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const addEditEquipo = async (info) => {
    var conn;
    try {
        var desc = Buffer.from(info.descripcion);
        conn = await pool.getConnection();
        if (parseInt(info.idequipo) === 0) {
            const [result] = await conn.query('INSERT INTO equipo (nombre,descripcion,idcampeonato,numparticipantes,idclub) VALUES (?,?,?,?,?);',
                [info.nombre, desc, info.idcampeonato, info.numPart, info.club])
            await conn.commit()
            return { "ok": "GUARDADO" }
        } else {
            const [result] = await conn.query('UPDATE equipo SET nombre=?,descripcion=?,idcampeonato=?,numparticipantes=?,idclub=? WHERE idequipo=?;',
                [info.nombre, desc, info.idcampeonato, info.numPart, info.club, info.idequipo])
            await conn.commit()
            return { "ok": "ACTUALIZANDO" }
        }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getEquipoDemostration = async (info) => {
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT * from equipo where idcampeonato=? and estado!="E";',
            [info.idCampeonato])
        console.log(result)
        return { "ok": result }
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
        console.log(info);
        conn = await pool.getConnection();
        if (info.tipo != 'D') {
            var sql = `SELECT *,(select nombre from club where idclub=c.idclub) as club,
                (select ad.ruta from adjunto ad where ad.idadjunto=c.idadjunto)as foto,
                (select nombre from cinturon where idcinturon=c.idcinturon) as cinturon 
                FROM competidor c WHERE c.idcampeonato=? and (0=? or c.idclub=?) and c.tipo=? 
                and c.genero=? and c.estado!="E";`
            const [result] = await conn.query(sql,
                [info.idCampeonato, info.club, info.club,info.tipo, info.genero])
            return { "ok": result }
        } else {
            const [result] = await conn.query('SELECT * from equipo where idcampeonato=? and (0=? or c.idclub=?) and estado!="E";',
                [info.idCampeonato, info.club,info.club])
            console.log(result)
            return { "ok": result }
        }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const deleteEquipo = async (info) => {
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query('UPDATE equipo SET estado=? WHERE idequipo=?;',
            [info.estado, info.idequipo])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const deleteCompetidor = async (info) => {
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query('UPDATE competidor SET estado=? WHERE idcompetidor=?;',
            [info.estado, info.idcompetidor])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const deleteCompetidorSP = async (info) => {
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query('UPDATE competidorsinpelea SET estado=? WHERE idcompetidor=?;',
            [info.estado, info.idcompetidor])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const getCompetidorClasificado = async (info) => {
    var sql = 'SELECT * FROM (SELECT *,(select nombre from club where idclub=c.idclub) as club, ' +
        '(select nombre from cinturon where idcinturon=c.idcinturon) as cinturon, ' +
        '(SELECT gr.nombre FROM grado gr inner join cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado, ' +
        '(select cate.idcategoria from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as idcategoria, ' +
        '(select cate.nombre from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as nombrecategoria, ' +
        '(select subcate.idsubcategoria from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria ' +
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as idsubcategoria, ' +
        '(select subcate.nombre from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria ' +
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as nombresubcategoria ' +
        'FROM competidor c WHERE c.idcampeonato=? and c.tipo=? and c.genero=? and c.estado="A") as res where res.idcategoria in (select idcategoria from categoria where estado="A") order by res.idgrado;'
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql,
            [info.idCampeonato, info.tipo, info.genero])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getCompetidorClasificadoLista = async (info) => {
    var sql1 = 'SELECT * FROM (SELECT *,(select nombre from club where idclub=c.idclub) as club, ' +
        '(select nombre from cinturon where idcinturon=c.idcinturon) as cinturon, ' +
        '(SELECT gr.nombre FROM grado gr inner join cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado, ' +
        '(select cate.idcategoria from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as idcategoria, ' +
        '(select cate.nombre from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as nombrecategoria, ' +
        '(select subcate.idsubcategoria from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria ' +
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as idsubcategoria, ' +
        '(select subcate.nombre from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria ' +
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as nombresubcategoria ' +
        'FROM competidor c WHERE c.idcampeonato=? and c.tipo=? and c.genero=? and c.estado="A" and (c.idclub=? or ?=0)) as res where res.idcategoria in (select idcategoria from categoria where estado="A") order by res.idgrado;'
    var sql = `select res.*,subcate.idsubcategoria,subcate.pesoini,subcate.pesofin,subcate.nombre as nombresubcategoria from 
            (SELECT c.*,cat.idcategoria,cat.nombre as nombrecategoria,cat.edadini,cat.edadfin,
            (select nombre from club where idclub=c.idclub) as club, 
            (select nombre from cinturon where idcinturon=c.idcinturon) as cinturon, 
            (SELECT gr.nombre FROM grado gr inner join cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado
            FROM competidor c left join categoria cat on (c.edad>=cat.edadini and c.edad<=cat.edadfin and cat.idcampeonato=c.idcampeonato and c.genero=cat.genero)
            WHERE c.idcampeonato=? and c.tipo=? and c.genero=?  and c.estado="A" 
            and (c.idclub=? or ?=0) )res left join subcategoria subcate on res.idcategoria=subcate.idcategoria
            where (res.peso+0.001)>=subcate.pesoini and (res.peso-0.001)<=subcate.pesofin
            order by res.idcompetidor`
    var sql3 = `select count(idllave)as numLLaves from llave where idcampeonato=? and tipo=? and genero=? and estado='A';`
    var sql6 = `SELECT COUNT(idclasificacion) FROM clasificacion WHERE idcampeonato=? AND tipo=? AND genero=? AND estado='A';`
    var sql4 = `DROP TEMPORARY TABLE IF EXISTS lista_comp;`
    var sql5 = `CREATE TEMPORARY TABLE lista_comp AS
        SELECT * FROM competidor WHERE idcampeonato=?
        UNION 
        SELECT 0, 'SIN OPONENTE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', NULL, NULL, NULL, NULL;`
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql,
            [info.idCampeonato, info.tipo, info.genero, info.idClub, info.idClub])
        var sqlf=''
        if (info.tipo=='C'){
            sqlf=sql3;
        }else{
            sqlf=sql6;
        }
        const [hayLlave] = await conn.query(sqlf,[info.idCampeonato,info.tipo,info.genero])
        await conn.query(sql4)
        await conn.query(sql5,[info.idCampeonato])
        return { "ok": {'lista':result,'hayLlave':hayLlave} }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getCompetidorSinPelea = async (info) => {
    var sql = 'SELECT * FROM (SELECT *,(select nombre from club where idclub=c.idclub) as club, ' +
        '(select nombre from cinturon where idcinturon=c.idcinturon) as cinturon, ' +
        '(SELECT gr.nombre FROM grado gr inner join cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado, ' +
        '(select cate.idcategoria from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as idcategoria, ' +
        '(select cate.nombre from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as nombrecategoria, ' +
        '(select subcate.idsubcategoria from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria ' +
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as idsubcategoria, ' +
        '(select subcate.nombre from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria ' +
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as nombresubcategoria ' +
        'FROM competidorsinpelea c WHERE c.idcampeonato=? and c.tipo=? and c.genero=? and c.estado="A" and (c.idclub=? or 0=?)) res where (res.idcategoria=? or 0=?)  order by res.idgrado;'
    var sql1 = `select res.*,subcate.idsubcategoria,subcate.pesoini,subcate.pesofin,subcate.nombre as nombresubcategoria from 
        (SELECT c.*,cat.idcategoria,cat.nombre as nombrecategoria,cat.edadini,cat.edadfin,
        (select nombre from club where idclub=c.idclub) as club, 
        (select nombre from cinturon where idcinturon=c.idcinturon) as cinturon, 
        (SELECT gr.nombre FROM grado gr inner join cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado
        FROM competidorsinpelea c left join categoria cat on (c.edad>=cat.edadini and c.edad<=cat.edadfin and cat.idcampeonato=c.idcampeonato and c.genero=cat.genero)
        WHERE c.idcampeonato=? and c.tipo=? and c.genero=?  and c.estado="A" 
        and (c.idclub=? or ?=0) )res left join subcategoria subcate on res.idcategoria=subcate.idcategoria
        where (res.peso+0.001)>=subcate.pesoini and (res.peso-0.001)<=subcate.pesofin and (res.idcategoria=? or 0=?)
        order by res.idgrado;`;
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql1,
            [info.idCampeonato, info.tipo, info.genero, info.idClub, info.idClub, info.idCategoria, info.idCategoria])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getCompetidoresFestival = async (info) => {
    var sql = 'SELECT * FROM (SELECT *,(select nombre from club where idclub=c.idclub) as club, ' +
        '(select nombre from cinturon where idcinturon=c.idcinturon) as cinturon, ' +
        '(SELECT gr.nombre FROM grado gr inner join cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado, ' +
        '(select cate.idcategoria from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as idcategoria, ' +
        '(select cate.nombre from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as nombrecategoria, ' +
        '(select subcate.idsubcategoria from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria ' +
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as idsubcategoria, ' +
        '(select subcate.nombre from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria ' +
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as nombresubcategoria ' +
        'FROM competidor c WHERE c.idcampeonato=? and c.tipo=? and c.genero=?  and c.estado="A" and (c.idclub=? or ?=0) ) as res where res.idcategoria in (select idcategoria from categoria where estado="P") order by res.edad,res.peso;';
    var sql1 = `select res.*,subcate.idsubcategoria,subcate.pesoini,subcate.pesofin,subcate.nombre as nombresubcategoria from 
            (SELECT c.*,cat.idcategoria,cat.nombre as nombrecategoria,cat.edadini,cat.edadfin,
            (select nombre from club where idclub=c.idclub) as club, 
            (select nombre from cinturon where idcinturon=c.idcinturon) as cinturon, 
            (SELECT gr.nombre FROM grado gr inner join cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado
            FROM competidor c left join categoria cat on (c.edad>=cat.edadini and c.edad<=cat.edadfin and cat.idcampeonato=c.idcampeonato and c.genero=cat.genero)
            WHERE c.idcampeonato=? and c.tipo=? and c.genero=?  and c.estado="A" 
            and (c.idclub=? or ?=0) )res left join subcategoria subcate on res.idcategoria=subcate.idcategoria
            where (res.peso+0.001)>=subcate.pesoini and (res.peso-0.001)<=subcate.pesofin 
            and res.idcategoria in (select idcategoria from categoria where estado="P")
            order by res.edad,res.peso`;
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql,
            [info.idCampeonato, info.tipo, info.genero, info.idClub, info.idClub])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
const getCompetidorClasificados = async (info) => {
    var sql = 'SELECT * FROM (SELECT *,(select nombre from club where idclub=c.idclub) as club, ' +
        '(select nombre from cinturon where idcinturon=c.idcinturon) as cinturon, ' +
        '(SELECT gr.nombre FROM grado gr inner join cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado, ' +
        '(select cate.idcategoria from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as idcategoria, ' +
        '(select cate.nombre from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as nombrecategoria, ' +
        '(select subcate.idsubcategoria from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria ' +
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as idsubcategoria, ' +
        '(select subcate.nombre from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria ' +
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as nombresubcategoria ' +
        'FROM competidor c WHERE c.idcampeonato=? and c.tipo=? and c.genero=? and c.estado="A" and c.idgrado=?)res ' +
        'where res.idcategoria=? and res.idsubcategoria=? ; '
    var sql1 = `select res.*,subcate.idsubcategoria,subcate.pesoini,subcate.pesofin,subcate.nombre as nombresubcategoria from 
            (SELECT c.*,cat.idcategoria,cat.nombre as nombrecategoria,cat.edadini,cat.edadfin,
            (select nombre from club where idclub=c.idclub) as club, 
            (select nombre from cinturon where idcinturon=c.idcinturon) as cinturon, 
            (SELECT gr.nombre FROM grado gr inner join cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado
            FROM competidor c left join categoria cat on (c.edad>=cat.edadini and c.edad<=cat.edadfin and cat.idcampeonato=c.idcampeonato and c.genero=cat.genero)
            WHERE c.idcampeonato=? and c.tipo=? and c.genero=?  and c.estado="A" 
            and c.idgrado=? )res left join subcategoria subcate on res.idcategoria=subcate.idcategoria
            where (res.peso+0.001)>=subcate.pesoini and (res.peso-0.001)<=subcate.pesofin
            and res.idcategoria=? and subcate.idsubcategoria=?;`;
    var conn;
    try {
        console.log(info)
        conn = await pool.getConnection();
        const [result] = await conn.query(sql1,
            [info.idCampeonato, info.tipo, info.genero, info.idgrado, info.idcategoria, info.idsubcategoria])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
function getNumLL(numC){
    if(numC<=4){
        return 4
    }else if (numC>4&&numC<=8){
        return 8
    }else if(numC>8&&numC<=16){
        return 16
    }else{
        return 32
    }
}
const procesarLlave =async(info)=>{
    var sql = `SELECT idpelea,idllave,idganador,tipo FROM pelea WHERE idganador is not NULL
        AND idllave=? AND tipo=? ORDER BY idpelea;`
    var sql1 = 'INSERT INTO pelea (idllave,idcompetidor1,idcompetidor2,nropelea,idganador,tipo) VALUES (?,?,?,?,?,?);'
    var conn;
    try {
        conn = await pool.getConnection();
        var [result]= await conn.query(sql,[info.idllave,info.nivel]);
        if(result.length>1){
            for (var i=0 ;i<result.length;i+=2){
                if(Math.abs(result[i].idpelea-result[i+1].idpelea)==1){
                    await conn.query(sql1,[info.idllave,result[i].idganador,result[i+1].idganador,0,null,info.nivel+1])
                    await conn.commit()
                }
            }
        }
        return {'ok':"okey "}
    } catch (error) {
        await conn.rollback()
        return { "error": error.message }
    }finally {
        if (conn) { await conn.release(); }
    }
}
const generarPelea = async (info) => {
    var sql = 'INSERT INTO pelea (idllave,idcompetidor1,idcompetidor2,nropelea,idganador) VALUES (?,?,?,?,?);'
    var conn;
    try {
        var competidores = info.COMPETIDORES.sort(function (a, b) { return (Math.random() - 0.5) })
        var numCmp = competidores.length;
        var listaId = competidores.map((item)=>item.idcompetidor);
        conn = await pool.getConnection();
        if(listaId.length!=2){
            var nBy = getNumLL(numCmp)-numCmp;
            for (let i=0 ;i <nBy;i++){
                if(i%2==0){
                    listaId=[0].concat(listaId);
                }else{
                    listaId.push(0);
                }   
            }
        }
        for (let i = 0; i < listaId.length; i += 2) {
            var idGanador=null;
            if(listaId[i]==0){
                idGanador=listaId[i+1];
            }else if(listaId[i+1]==0){
                idGanador=listaId[i];
            }else if(listaId[i]==0 && listaId[i+1]){
                idGanador=0;
            }
            const [result] = await conn.query(sql, [info.idllave, listaId[i], listaId[i + 1], 0,idGanador]);
            await conn.commit();
        }
        await procesarLlave({'idllave':info.idllave,'nivel':0})
        return { "ok": "generado" }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const generarLlaveRompimientoFestival = async (info) => {
    var sql = 'SELECT idgrado,nombre,tipo FROM grado where estado="A" and idcampeonato=? and tipo=?;';
    var sql1 = 'SELECT idtipo,descripcion FROM tiposcampeonato where estado="A" and idcampeonato=? and tipo=?;'
    var sql2 = 'insert into clasificacion (idcompetidor,tipo,idgrado,idcategoria,idsubcategoria,idcampeonato,genero,idtipocompetencia,orden) values (?,?,?,?,?,?,?,?,?);';
    var sql3 = "SELECT * FROM (SELECT *,(select nombre from club where idclub=c.idclub) as club, " +
        "(select nombre from cinturon where idcinturon=c.idcinturon) as cinturon, " +
        "(SELECT gr.nombre FROM grado gr inner join cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado, " +
        "(select cate.idcategoria from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin " +
        "and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as idcategoria, " +
        "(select cate.nombre from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin " +
        "and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as nombrecategoria, " +
        "(select subcate.idsubcategoria from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria " +
        "where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as idsubcategoria, " +
        "(select subcate.nombre from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria " +
        "where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as nombresubcategoria " +
        "FROM competidor c WHERE c.idcampeonato=? and c.tipo=? and c.genero=? and c.estado='A' and c.idgrado=?)res " +
        "where res.idcategoria=?;"
    var conn;
    try {
        conn = await pool.getConnection();
        const [listaTipos] = await conn.query(sql1, [info.idCampeonato, info.tipo])
        const [result] = await conn.query(sql, [info.idCampeonato, info.tipo])
        var ordenP = 1;
        for (var grado of result) {
            for (var cat of info.categorias) {
                var [competidores] = await conn.query(sql3, [info.idCampeonato, info.tipo,info.genero,grado.idgrado,cat.idcategoria]);
                if (competidores.length !== 0) {
                    competidores.sort(function (a, b) { return (Math.random() - 0.5) });
                    for (var tipoc of listaTipos) {
                        var filtrado = competidores.filter((item) => {
                            var aux = item.idtipocompetencia.split(':');
                            if (aux.indexOf(tipoc.idtipo.toString()) != -1) {
                                return true
                            } else {
                                return false
                            }
                        });
                        for (var fl of filtrado) {
                            await conn.query(sql2, [fl.idcompetidor, fl.tipo, fl.idgrado, fl.idcategoria,0, fl.idcampeonato, fl.genero, tipoc.idtipo, ordenP]);
                            ordenP += 1;
                        }
                    }
                }
            }
        }
        return { "ok": "Clasificación Correcta !" }
    } catch (error) {
        console.log(error);
        await conn.rollback();
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release() }
    }
}
export const generarLlaveRompimiento = async (info) => {
    var sql = 'SELECT idgrado,nombre,tipo FROM grado where estado="A" and idcampeonato=? and tipo=?;';
    var sql1 = 'SELECT idtipo,descripcion FROM tiposcampeonato where estado="A" and idcampeonato=? and tipo=?;'
    var sql2 = 'insert into clasificacion (idcompetidor,tipo,idgrado,idcategoria,idsubcategoria,idcampeonato,genero,idtipocompetencia,orden) values (?,?,?,?,?,?,?,?,?);';
    var conn;
    try {
        conn = await pool.getConnection();
        const [listaTipos] = await conn.query(sql1, [info.idCampeonato, info.tipo])
        const [result] = await conn.query(sql, [info.idCampeonato, info.tipo])
        var ordenP = 1;
        for (var grado of result) {
            for (var cat of info.categorias) {
                var subcategorias = cat.SUBCATEGORIA;
                for (var subc of subcategorias) {
                    var filtros = {
                        'idCampeonato': info.idCampeonato,
                        'tipo': info.tipo,
                        'genero': info.genero,
                        'idgrado': grado.idgrado,
                        'idcategoria': cat.idcategoria,
                        'idsubcategoria': subc.idsubcategoria
                    }
                    var competidores = await getCompetidorClasificados(filtros);
                    if (competidores.ok) {
                        if (competidores.ok.length !== 0) {
                            competidores.ok.sort(function (a, b) { return (Math.random() - 0.5) });
                            for (var tipoc of listaTipos) {
                                var filtrado = competidores.ok.filter((item) => {
                                    var aux = item.idtipocompetencia.split(':');
                                    if (aux.indexOf(tipoc.idtipo.toString()) != -1) {
                                        return true
                                    } else {
                                        return false
                                    }
                                });
                                for (var fl of filtrado) {
                                    await conn.query(sql2, [fl.idcompetidor, fl.tipo, fl.idgrado, fl.idcategoria, fl.idsubcategoria, fl.idcampeonato, fl.genero, tipoc.idtipo, ordenP]);
                                    ordenP += 1;
                                }
                            }
                        }
                    }
                }
            }
        }
        return { "ok": "Clasificación Correcta !" }
    } catch (error) {
        console.log(error);
        await conn.rollback();
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release() }
    }
}

export const generateLLaves = async (info) => {
    var sql = 'SELECT idgrado,nombre,tipo FROM grado where estado="A" and idcampeonato=? and tipo=?;'
    var sql2 = 'INSERT INTO llave (tipo,idgrado,genero,idcategoria,idsubcategoria,idcampeonato) VALUES (?,?,?,?,?,?) ;'
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.idCampeonato, info.tipo])
        for (var grado of result) {
            for (var cat of info.categorias) {
                var subcategorias = cat.SUBCATEGORIA;
                for (var subc of subcategorias) {
                    var filtros = {
                        'idCampeonato': info.idCampeonato,
                        'tipo': info.tipo,
                        'genero': info.genero,
                        'idgrado': grado.idgrado,
                        'idcategoria': cat.idcategoria,
                        'idsubcategoria': subc.idsubcategoria
                    }
                    var competidores = await getCompetidorClasificados(filtros)
                    console.log(competidores)
                    if (competidores.ok) {
                        if (competidores.ok.length >= 2) {
                            const [result] = await conn.query(sql2, [info.tipo, grado.idgrado, info.genero, cat.idcategoria, subc.idsubcategoria, info.idCampeonato])
                            await conn.commit();
                            var idllave = result.insertId;
                            var peleas = await generarPelea({ idllave, 'COMPETIDORES': competidores.ok })
                            if (peleas.error) {
                                return { "error": peleas.error }
                            }
                        } else if (competidores.ok.length == 1) {
                            var est = competidores.ok[0]
                            const [result] = await conn.query('INSERT INTO competidorsinpelea (nombres,apellidos,fecha,edad,peso,ci,idclub,idcinturon,idcampeonato,tipo,idgrado,genero,altura) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);',
                                [est.nombres, est.apellidos, est.fecha, est.edad, est.peso, est.ci, est.idclub, est.idcinturon, est.idcampeonato, est.tipo, est.idgrado, est.genero, est.altura])
                            console.log(result)
                            console.log(result.insertId)
                            await conn.commit()
                        }
                    } else {
                        return { "error": "ocurrio un problema al generar las llaves" }
                    }
                }
            }
        }
        return { "ok": "Generado llaves correctamente" }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const generateLLaveManual = async (info) => {
    var sql = 'INSERT INTO pelea (idllave,idcompetidor1,idcompetidor2,nropelea) VALUES (?,?,?,?);'
    var sql2 = 'INSERT INTO llave (tipo,idgrado,genero,idcategoria,idsubcategoria,idcampeonato) VALUES (?,?,?,?,?,?) ;'
    var sql3 = 'UPDATE competidorsinpelea SET estado="G" WHERE idcompetidor=? '
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql2, [info.tipo, -1, info.genero, -1, -1, info.idCampeonato])
        await conn.commit();
        var idllave = result.insertId;
        var competidores = info.listaManual.sort(function (a, b) { return (Math.random() - 0.5) })
        var numPelea = 1;
        for (let i = 0; i < competidores.length; i += 2) {
            if (i + 1 <= competidores.length - 1) {
                const [result] = await conn.query(sql, [idllave, competidores[i].idcompetidor, competidores[i + 1].idcompetidor, numPelea]);
                await conn.query(sql3, [competidores[i].idcompetidor]);
                await conn.query(sql3, [competidores[i + 1].idcompetidor]);
                await conn.commit();
                numPelea += 1;
            } else {
                const [result] = await conn.query(sql, [idllave, competidores[i].idcompetidor, 0, numPelea]);
                await conn.query(sql3, [competidores[i].idcompetidor]);
                await conn.commit();
            }
        }
        return { "ok": "generado" }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const generateLLaveManualFestival = async (info) => {
    var sql = 'INSERT INTO pelea (idllave,idcompetidor1,idcompetidor2,nropelea) VALUES (?,?,?,?);'
    var sql2 = 'INSERT INTO llave (tipo,idgrado,genero,idcategoria,idsubcategoria,idcampeonato) VALUES (?,?,?,?,?,?) ;'
    var sql3 = 'UPDATE competidorsinpelea SET estado="E" WHERE idcompetidor=? '
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql2, [info.tipo, -1, info.genero, -1, -1, info.idCampeonato])
        await conn.commit();
        var idllave = result.insertId;
        var competidores = info.listaManual.sort(function (a, b) { return (Math.random() - 0.5) })
        var numPelea = 1;
        for (let i = 0; i < competidores.length; i += 2) {
            if (i + 1 <= competidores.length - 1) {
                const [result] = await conn.query(sql, [idllave, competidores[i].idcompetidor, competidores[i + 1].idcompetidor, numPelea]);
                await conn.query(sql3, [competidores[i].idcompetidor]);
                await conn.query(sql3, [competidores[i + 1].idcompetidor]);
                await conn.commit();
                numPelea += 1;
            } else {
                const [result] = await conn.query(sql, [idllave, competidores[i].idcompetidor, 0, numPelea]);
                await conn.query(sql3, [competidores[i].idcompetidor]);
                await conn.commit();
            }
        }
        return { "ok": "generado" }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const generarLlavePoomse = async (info) => {
    var conn;
    var sql = 'SELECT idgrado,nombre,tipo FROM grado where estado="A" and idcampeonato=? and tipo=?;'
    var sql1 = 'SELECT * FROM (SELECT *,(select nombre from club where idclub=c.idclub) as club, ' +
        '(select nombre from cinturon where idcinturon=c.idcinturon) as cinturon, ' +
        '(SELECT gr.nombre FROM grado gr inner join cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado, ' +
        '(select cate.idcategoria from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as idcategoria, ' +
        '(select cate.nombre from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as nombrecategoria, ' +
        '(select subcate.idsubcategoria from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria ' +
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as idsubcategoria, ' +
        '(select subcate.nombre from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria ' +
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as nombresubcategoria ' +
        'FROM competidor c WHERE c.estado="A" and c.idcampeonato=? and c.tipo=? and c.genero=? and c.idgrado=?)res ' +
        'where res.idcategoria=?'
    var sql2 = 'insert into clasificacion (idcompetidor,tipo,idgrado,idcategoria,idsubcategoria,idcampeonato,genero,idcinturon) values (?,?,?,?,?,?,?,?);';
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.idCampeonato, info.tipo])
        console.log(result)
        for (var grado of result) {
            for (var cat of info.categorias) {
                var filtros = [info.idCampeonato, info.tipo, info.genero, grado.idgrado, cat.idcategoria];
                var [competidores] = await conn.query(sql1, filtros)
                if (competidores.length !== 0) {
                    //competidores.sort(function (a, b) { return (Math.random() - 0.5) });
                    for (var cp of competidores) {
                        await conn.query(sql2, [cp.idcompetidor, info.tipo, cp.idgrado, cp.idcategoria, cp.idsubcategoria, cp.idcampeonato, cp.genero, cp.idcinturon])
                    }
                }
            }
        }
        await conn.commit();
        return { "ok": "Generado llaves correctamente" }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release() }
    }
}

export const obtenerLlaveRompimineto = async (info) => {
    var sql = "select cls.idclasificacion,cls.idcompetidor,cls.tipo,cls.idgrado,cls.idcategoria,cls.idcampeonato,cls.idsubcategoria, " +
        "cls.estado,cls.genero,cls.idtipocompetencia,cmp.nombres,cmp.apellidos,cmp.edad,cmp.peso,cmp.idclub, " +
        "(select nombre from club where cmp.idclub=idclub) as club, (select nombre from grado where cls.idgrado=idgrado) as grado, " +
        "cat.nombre,cat.edadini,cat.edadfin,sbcat.nombre,sbcat.pesoini,sbcat.pesofin,cls.orden, " +
        "(select descripcion from tiposcampeonato where cls.idtipocompetencia=idtipo)as tiponombre,cls.idcinturon, " +
        "(select nombre from cinturon where idcinturon=cls.idcinturon) as cinturon,cls.puntuacion " +
        "from clasificacion cls inner join competidor cmp on cmp.idcompetidor=cls.idcompetidor " +
        "inner join categoria cat on cls.idcategoria=cat.idcategoria " +
        "inner join subcategoria sbcat on sbcat.idsubcategoria=cls.idsubcategoria" +
        " where cls.idcampeonato=? and cls.estado ='A' and cls.genero=? and cls.tipo=? ;";
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.idCampeonato, info.genero, info.tipo]);
        console.log(result);
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release() }
    }
}

export const obtenerLlaves = async (info) => {
    var sql0 = 'select * from (SELECT lv.idllave,lv.fecha,lv.tipo,lv.idgrado,lv.genero,lv.idcategoria,lv.idsubcategoria,lv.idcampeonato,lv.estado,lv.area, ' +
        'gr.nombre as nombregrado,cat.nombre as nombrecategoria,scat.nombre as nombresubcategoria,cat.edadini,cat.edadfin,scat.pesoini,scat.pesofin ' +
        'FROM llave lv INNER JOIN grado gr on gr.idgrado=lv.idgrado ' +
        'INNER JOIN categoria cat on cat.idcategoria=lv.idcategoria ' +
        'INNER JOIN subcategoria scat on scat.idsubcategoria=lv.idsubcategoria ' +
        'WHERE lv.tipo=? and lv.idcampeonato=? and lv.estado="A" and cat.idcategoria=? ' +
        'UNION SELECT idllave,fecha,tipo,idgrado,genero,idcategoria,idsubcategoria,idcampeonato,estado,0,"EXHIBICIÓN","EXHIBICIÓN","EXHIBICIÓN",1,1,1,1 FROM llave where idgrado=-1 and tipo=? and idcampeonato=? and estado="A" )res order by res.idllave,res.genero ;';
    var sql =`SELECT lv.idllave,lv.fecha,lv.tipo,lv.genero,lv.idcategoria,lv.idsubcategoria,lv.idgrado,
        lv.estado,lv.area,cat.nombre AS nombrecategoria,cat.edadini,cat.edadfin,grad.nombre AS nombregrado,
        subcat.nombre AS nombresubcategoria,subcat.pesoini,subcat.pesofin
        FROM llave lv 
        INNER JOIN 
        (SELECT c.* from categoria c WHERE estado='A' 
            UNION SELECT -1,'EXHIBICIÓN',1,1,?,'M','A'
            UNION SELECT -1,'EXHIBICIÓN',1,1,?,'F','A') cat
        ON lv.idcategoria=cat.idcategoria and lv.genero=cat.genero
        LEFT JOIN 
        (SELECT -1 AS idgrado,'MANUAL' AS nombre,'C'AS tipo,? AS idcampeonato,'A' AS estado UNION
        SELECT gr.* FROM grado gr WHERE gr.estado!='E') grad
        ON grad.idgrado=lv.idgrado
        LEFT JOIN 
        (SELECT -1 AS idsubcategoria,-1 AS idcategoria,'EXHIBICIÓN' AS nombre,-1 AS pesoini,
        -1 AS pesofin UNION SELECT subc.* FROM subcategoria subc) subcat
        ON subcat.idsubcategoria=lv.idsubcategoria
        WHERE lv.estado='A' and lv.idcampeonato=? AND (?=-2 OR lv.idcategoria=?) AND lv.tipo=? ORDER BY lv.area;`
    var sql4 = `SELECT res.idpelea,res.idpeleapadre,res.idllave,res.idcompetidor1,res.idcompetidor2,
        res.nropelea,res.idganador,res.idperdedor,res.nombres,res.apellidos,res.clubuno,res.tipo,
        cm.nombres as nombres2,cm.apellidos as apellidos2,cm.idclub as idclubdos,cm.altura as alturados,res.idclubuno,
		  (select cl.nombre from club cl where cl.idclub=cm.idclub) as clubdos,res.alturauno,
        cm.peso as pesodos,cm.edad as edaddos,res.edaduno,res.pesouno,cm.cinturondos,res.cinturonuno
        FROM 
        (SELECT p.idpelea,p.idpeleapadre,p.idllave,p.idcompetidor1,
		  	p.idcompetidor2,p.nropelea,p.idganador,p.idperdedor,p.tipo,c.nombres,c.apellidos, 
        (select cl.nombre from club cl where cl.idclub=c.idclub) as clubuno,c.idclub as idclubuno,
		  c.edad AS edaduno,c.peso AS pesouno,c.cinturonuno,c.altura as alturauno
        FROM pelea p left join (SELECT c.*,cnt.nombre AS cinturonuno FROM competidor c 
        INNER JOIN cinturon cnt ON cnt.idcinturon=c.idcinturon
		  where idcampeonato=? and estado='A' 
        UNION SELECT 0, 'SIN OPONENTE', NULL, NULL, NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL, 'A', NULL, NULL, NULL, NULL,NULL) c 
			on c.idcompetidor=p.idcompetidor1) res
        INNER JOIN (SELECT c.*,cnt.nombre AS cinturondos FROM competidor c INNER JOIN cinturon cnt ON cnt.idcinturon=c.idcinturon
		  where idcampeonato=? and estado='A'
        UNION SELECT 0, 'SIN OPONENTE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', NULL, NULL, NULL, NULL,NULL) cm 
        on cm.idcompetidor=res.idcompetidor2 WHERE res.idllave=? order by res.idpelea;`
    var sql2 = `select res.idpelea,res.idpeleapadre,res.idllave,res.idcompetidor1,res.idcompetidor2,res.nropelea,res.idganador,
        res.idperdedor,res.nombres,res.edad as edaduno,res.peso as pesouno,res.apellidos,res.clubuno,res.cinturonuno, 
        c.nombres as nombres2,c.apellidos as apellidos2,(select cl.nombre from club cl where cl.idclub=c.idclub) as clubdos,
        (select cin.nombre from cinturon cin where cin.idcinturon=c.idcinturon) as cinturondos,c.idclub AS idclubdos, 
        c.peso as pesodos,c.edad as edaddos,c.altura as alturados,res.tipo,res.idclubuno,res.alturauno
        from(select p.idpelea,p.idpeleapadre,p.idllave,p.idcompetidor1,p.idcompetidor2,p.nropelea,p.idganador,p.idperdedor,p.tipo,c.nombres,c.apellidos, 
        (select cl.nombre from club cl where cl.idclub=c.idclub) as clubuno,c.edad,c.peso,genero,c.idclub AS idclubuno, 
        (select cin.nombre from cinturon cin where cin.idcinturon=c.idcinturon) as cinturonuno,c.altura as alturauno
        from pelea p inner join competidorsinpelea c on p.idcompetidor1=c.idcompetidor) res inner join 
		(select * from competidorsinpelea union select 0,"SIN OPONENTE",null,null,null,null,null,null,null,null,null,null,"A",null,null) c on res.idcompetidor2=c.idcompetidor 
        where res.idllave=? order by res.idpelea;`;
    var conn;
    try {
        console.log(info)
        conn = await pool.getConnection();
        //const [result] = await conn.query(sql, [info.tipo, info.idCampeonato,info.idCategoria, info.tipo, info.idCampeonato]);
        const [result] = await conn.query(sql, [info.idCampeonato, info.idCampeonato,
            info.idCampeonato,info.idCampeonato,info.idCategoria,info.idCategoria, info.tipo]);
        var resultado = []
        for (var llaves of result) {
            if(llaves.idcategoria==-1){
                const [result] = await conn.query(sql2, [llaves.idllave]);
                resultado.push({ ...llaves, "PELEAS": result })
            }else{
                const [result] = await conn.query(sql4, [info.idCampeonato,info.idCampeonato,llaves.idllave])   
                resultado.push({ ...llaves, "PELEAS": result })
            }
        }
        return { "ok": resultado }
    } catch (error) {
        console.log(error)
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release() }
    }
}
export const obtenerLlavesManuales = async (info) => {
    var sql = 'select * from llave where tipo=? and idcampeonato=? and idcategoria=? and estado="A" order by genero ;';
    var sql2 = 'select res.idpelea,res.idpeleapadre,res.idllave,res.idcompetidor1,res.idcompetidor2,res.nropelea,res.idganador,res.idperdedor,res.nombres,res.edad,res.peso,res.apellidos,res.clubuno,res.cinturonuno, ' +
        'c.nombres as nombres2,c.apellidos as apellidos2,(select cl.nombre from club cl where cl.idclub=c.idclub) as clubdos,(select cin.nombre from cinturon cin where cin.idcinturon=c.idcinturon) as cinturondos, ' +
        'c.peso as peso2,c.edad as edad2 ' +
        'from(select p.idpelea,p.idpeleapadre,p.idllave,p.idcompetidor1,p.idcompetidor2,p.nropelea,p.idganador,p.idperdedor,c.nombres,c.apellidos, ' +
        '(select cl.nombre from club cl where cl.idclub=c.idclub) as clubuno,c.edad,c.peso,genero, ' +
        '(select cin.nombre from cinturon cin where cin.idcinturon=c.idcinturon) as cinturonuno ' +
        'from pelea p inner join competidorsinpelea c on p.idcompetidor1=c.idcompetidor) res inner join (select * from competidorsinpelea union select 0,"SIN OPONENTE",null,null,null,null,null,null,null,null,null,null,"A",null,null) c on res.idcompetidor2=c.idcompetidor ' +
        'where res.idllave=? order by res.idpelea;';
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.tipo, info.idCampeonato, info.idCategoria]);
        var resultado = []
        for (var llaves of result) {
            const [result] = await conn.query(sql2, [llaves.idllave])
            resultado.push({ ...llaves, "PELEAS": result})
        }
        return { "ok": resultado }
    } catch (error) {
        console.log(error)
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release() }
    }
}

export const buscarCompetidor = async (info) => {
    var sql = 'SELECT * FROM (SELECT *,(select nombre from club where idclub=c.idclub) as club, ' +
        '(select nombre from cinturon where idcinturon=c.idcinturon) as cinturon, ' +
        '(SELECT gr.nombre FROM grado gr inner join cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado, ' +
        '(select cate.idcategoria from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as idcategoria, ' +
        '(select cate.nombre from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as nombrecategoria, ' +
        '(select subcate.idsubcategoria from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria ' +
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as idsubcategoria, ' +
        '(select subcate.nombre from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria ' +
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as nombresubcategoria, ' +
        "(concat_ws(' ', nombres, apellidos)) as nombrex " +
        "FROM competidor c ) as res where res.nombrex like '%" + info.competidor + "%'";
    var conn;
    try {
        console.log(sql);
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.club,info.club])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const cambiarNumPelea = async (info) => {
    var sql = 'UPDATE pelea set nropelea=? where idpelea=?'
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.nropelea, info.idpelea])
        await conn.commit();
        return { "ok": "Se cambio el numero de pelea ..." }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const cambiarAreaLlave = async (info) => {
    var sql = "UPDATE llave set area=? where idllave=?"
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.area, info.idllave])
        await conn.commit();
        return { "ok": "Se cambio el numero de llave ..." }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const obtenerDatosPuntuados = async (info) => {
    var sql = 'select res.idclub,res.nombre,res.abreviado,count(ct.estado) as oro from (select cl.idclub,cl.nombre,cl.abreviado,(select cate.idcategoria from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin ' +
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as idcategoria ' +
        'from competidor c inner join club cl on cl.idclub=c.idclub where cl.puntuado="A" and c.estado="A" and c.idcampeonato=? and c.tipo=?) res inner join categoria ct on ct.idcategoria=res.idcategoria ' +
        'where ct.estado="P" group by res.idclub ;'
    var sql2 = 'select csn.idclub,c.nombre,c.abreviado,count(csn.idclub) as oro from competidorsinpelea csn inner join club c on c.idclub=csn.idclub and c.puntuado="A" and csn.estado!="I" and csn.idcampeonato=? group by csn.idclub;'
    var conn;
    try {
        conn = await pool.getConnection();
        const [resultP] = await conn.query(sql, [info.idCampeonato, 'P'])
        const [resultC] = await conn.query(sql, [info.idCampeonato, 'C'])
        const [resultSN] = await conn.query(sql2, [info.idCampeonato])
        return { "ok": { "FP": resultP, "FC": resultC, 'SNP': resultSN } }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const obtenerDatosPuntuadosR = async (info)=>{
    var sql = "select res.*,(select nombre from club where idclub=res.idclub) as nombre from( "+
        "select cl.posicion,sum(posicion) as total , cm.idclub "+
        "from clasificacion cl inner join competidor cm on cm.idcompetidor=cl.idcompetidor where cl.estado='C' and cl.idcampeonato=? and cl.tipo=? "+
        "and cl.idtipocompetencia in (select idtipo from tiposcampeonato where estado='A' and tipo='R' and idcampeonato=cl.idcampeonato ) "+
        "group by cm.idclub,cl.posicion order by cl.posicion asc)res;"
    var conn;
    try {
        conn = await pool.getConnection();
        const [resultP] = await conn.query(sql, [info.idCampeonato, info.tipo])
        return { "ok": resultP }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getInformacionRompimiento = async (info) => {
    var sql = "select cls.idclasificacion,cls.idcompetidor,cls.tipo,cls.idgrado,cls.idcategoria,cls.idcampeonato,cls.idsubcategoria," +
        " cls.estado,cls.genero,cls.idtipocompetencia,cmp.nombres,cmp.apellidos,cmp.edad,cmp.peso,cmp.idclub," +
        " (select nombre from club where cmp.idclub=idclub) as club, (select nombre from grado where cls.idgrado=idgrado) as grado," +
        " cat.nombre,cat.edadini,cat.edadfin,sbcat.nombre,sbcat.pesoini,sbcat.pesofin,cls.orden," +
        " (select descripcion from tiposcampeonato where cls.idtipocompetencia=idtipo and estado='A')as tiponombre,cls.idcinturon," +
        " (select nombre from cinturon where idcinturon=cls.idcinturon) as cinturon,cls.puntuacion,cls.rompio,cls.norompio,cls.posicion" +
        " from clasificacion cls inner join competidor cmp on cmp.idcompetidor=cls.idcompetidor" +
        " inner join categoria cat on cls.idcategoria=cat.idcategoria" +
        " inner join ((select * from subcategoria) union (select 0,0,'',0,0 )) sbcat on sbcat.idsubcategoria=cls.idsubcategoria" +
        " where cls.idcampeonato=? and cls.estado =? and cls.tipo=? order by cls.puntuacion desc;";
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.idCampeonato,info.estado,info.tipo]);
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release() }
    }
}
export const setPosition = async (info)=>{
    console.log(info);
    var sql = "update clasificacion set posicion=? where estado='C' and idclasificacion=?;";
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.valor,info.idclasificacion]);
        return { "ok": "Guardado" }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release() }
    }
}
export const eliminarPuntuacion = async (info)=>{
    console.log(info);
    var sql = "update clasificacion set estado=? where idclasificacion=?;";
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.estado,info.selectCompetidor.idclasificacion]);
        return { "ok": "Eliminado" }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release() }
    }
}

export const eliminarLlavesGeneradas = async(info)=>{
    var conn;
    var sql = "update llave set estado='E' where idcampeonato=? and tipo=?;"
    var sql2 = "update competidorsinpelea set estado='E' where idcampeonato=? and tipo=?;"
    try {
        conn = await pool.getConnection();
        await conn.query(sql,[info.idcampeonato,info.tipo]);
        await conn.query(sql2,[info.idcampeonato,info.tipo]);
        await conn.commit();
        return {'ok':"Eliminacion Correcta"}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    } finally {
        if (conn) {await conn.release()}
    }
}
export const eliminarLlaveManual = async(info)=>{
    var conn;
    var sql = "update llave set estado='E' where idcampeonato=? and idllave=?;"
    var sql2 = "update competidorsinpelea set estado='A' where idcampeonato=? and tipo=? and idcompetidor=?;"
    try {
        conn = await pool.getConnection();
        await conn.query(sql,[info.idcampeonato,info.idllave]);
        for (var i of info.idCompetidor){
            await conn.query(sql2,[info.idcampeonato,info.tipo,i]);
        }
        await conn.commit();
        return {'ok':"Eliminacion Correcta"}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    } finally {
        if (conn) {await conn.release()}
    }
}
export const addSeguimientoPelea = async(info)=>{
    var conn;
    var sql = `INSERT INTO pelea_seguimiento (idpelea,puntouno,faltasuno,puntodos,faltasdos,numround)
        VALUES (?,?,?,?,?,?);`
    try {
        conn = await pool.getConnection();
        await conn.query(sql,[info.idpelea,info.puntoA,info.faltaA,
            info.puntoR,info.faltaR,info.round]);
        await conn.commit();
        return {'ok':"Guardado ..."}
    } catch (error) {
        console.log(error);
        await conn.rollback();
        return {"error":error.message}
    } finally {
        if (conn) {await conn.release()}
    }
}
export const getSeguimientoPelea = async(info)=>{
    var conn;
    var sql = `SELECT * FROM pelea_seguimiento WHERE idpelea=?;`
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql,[info.idpelea]);
        return {'ok':result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    } finally {
        if (conn) {await conn.release()}
    }
}
const procesarLlaveAuto =async(info)=>{
    var sql = `SELECT idpelea,idllave,idganador,tipo FROM pelea WHERE idganador is not NULL
        AND idllave=? AND tipo=? ORDER BY idpelea;`
    var sql1 = 'INSERT INTO pelea (idllave,idcompetidor1,idcompetidor2,nropelea,idganador,tipo) VALUES (?,?,?,?,?,?);'
    var sql2 = `SELECT * from pelea where idllave=? and (idcompetidor1=? or idcompetidor2=?) and tipo=?`
    var conn;
    try {
        conn = await pool.getConnection();
        var [result]= await conn.query(sql,[info.idllave,info.nivel]);
        if(result.length>1){
            for (var i=0 ;i<result.length;i+=2){
                if(i<result.length-1){
                    var [hayPelea] = await conn.query(sql2,[info.idllave,result[i].idganador,result[i].idganador,info.nivel+1]);
                    if (hayPelea.length==0){
                        var idganador=null;
                        if(result[i].idganador==0){
                            idganador=result[i+1].idganador
                        }else if(result[i+1].idganador==0){
                            idganador=result[i].idganador
                        }
                        await conn.query(sql1,[info.idllave,result[i].idganador,result[i+1].idganador,0,idganador,info.nivel+1])
                        await conn.commit()
                    }
                }
            }
        }
        return {'ok':"okey "}
    } catch (error) {
        await conn.rollback()
        return { "error": error.message }
    }finally {
        if (conn) { await conn.release(); }
    }
}
export const saveFinalResultPelea = async (info)=>{
    var conn;
    var sql= `UPDATE pelea SET idganador=?,idperdedor=? WHERE idpelea=? AND idllave=?;`
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql,[info.idganador,info.idperdedor,info.idpelea,info.idllave]);
        await conn.commit();
        var procesado = await procesarLlaveAuto(info);
        if(procesado.ok){
            return {'ok':"Correcto"}
        }else{
            return procesado
        }
    } catch (error) {
        console.log(error);
        await conn.rollback();
        return {"error":error.message}
    } finally {
        if (conn) {await conn.release()}
    }
}
