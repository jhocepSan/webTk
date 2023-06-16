import { pool } from '../utils/connection.js'

export const addEditCompetidor = async (info) => {
    var conn;
    try {
        conn = await pool.getConnection();
        console.log(info);
        var tipoComt = info.listaCTipoC.map((item)=>item.idtipo).join(":");
        if (info.idCompetidor === 0) {
            const [result] = await conn.query('INSERT INTO competidor (nombres,apellidos,fecha,edad,peso,ci,idclub,idcinturon,idcampeonato,tipo,idgrado,genero,altura,idtipocompetencia) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
                [info.nombres, info.apellidos, info.fecha, info.edad, info.peso, info.ciUser, info.idClub, info.cinturon, info.idCampeonato, info.tipos, info.idGrado, info.genero, info.altura,tipoComt])
            return { "ok": "GUARDADO" }
        } else {
            const [result] = await conn.query('UPDATE competidor SET nombres=?,apellidos=?,fecha=?,edad=?,peso=?,ci=?,idclub=?,idcinturon=?,idcampeonato=?,tipo=?,idgrado=?,genero=?,altura=?,idtipocompetencia=? WHERE idcompetidor=?;',
                [info.nombres, info.apellidos, info.fecha, info.edad, info.peso, info.ciUser, info.idClub, info.cinturon, info.idCampeonato, info.tipos, info.idGrado, info.genero, info.altura, info.idCompetidor,tipoComt])
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
        const [result] = await conn.query('SELECT *,(select nombre from club where idclub=c.idclub) as club,(select nombre from cinturon where idcinturon=c.idcinturon) as cinturon FROM competidor c WHERE c.idcampeonato=? and c.idclub=? and c.tipo=? and c.genero=? and c.estado!="E";',
            [info.idCampeonato, info.club, info.tipo, info.genero])
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
        'FROM competidor c WHERE c.idcampeonato=? and c.tipo=? and c.genero=? and c.estado="A" and (c.idclub=? or ?=0)) as res where res.idcategoria in (select idcategoria from categoria where estado="A") order by res.idgrado;'
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql,
            [info.idCampeonato, info.tipo, info.genero,info.idClub,info.idClub])
        return { "ok": result }
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
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql,
            [info.idCampeonato, info.tipo, info.genero,info.idClub,info.idClub, info.idCategoria, info.idCategoria])
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
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql,
            [info.idCampeonato, info.tipo, info.genero,info.idClub,info.idClub])
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
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql,
            [info.idCampeonato, info.tipo, info.genero, info.idgrado, info.idcategoria, info.idsubcategoria])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
const generarPelea = async (info) => {
    var sql = 'INSERT INTO pelea (idllave,idcompetidor1,idcompetidor2,nropelea) VALUES (?,?,?,?);'
    var conn;
    try {
        var competidores = info.COMPETIDORES.sort(function (a, b) { return (Math.random() - 0.5) })
        var numPelea = 1;
        conn = await pool.getConnection();
        for (let i = 0; i < competidores.length; i += 2) {
            if (i + 1 <= competidores.length - 1) {
                const [result] = await conn.query(sql, [info.idllave, competidores[i].idcompetidor, competidores[i + 1].idcompetidor, numPelea]);
                await conn.commit();
                numPelea += 1;
            } else {
                const [result] = await conn.query(sql, [info.idllave, competidores[i].idcompetidor, 0, numPelea]);
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
export const generateLLaves = async (info) => {
    var sql = 'SELECT idgrado,nombre,tipo FROM grado where estado="A" and idcampeonato=? and tipo=?;'
    var sql2 = 'INSERT INTO llave (tipo,idgrado,genero,idcategoria,idsubcategoria,idcampeonato) VALUES (?,?,?,?,?,?) ;'
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.idCampeonato, info.tipo])
        console.log(result)
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

export const obtenerLlaves = async (info) => {
    var sql = 'select * from (SELECT lv.idllave,lv.fecha,lv.tipo,lv.idgrado,lv.genero,lv.idcategoria,lv.idsubcategoria,lv.idcampeonato,lv.estado, ' +
        'gr.nombre as nombregrado,cat.nombre as nombrecategoria,scat.nombre as nombresubcategoria,cat.edadini,cat.edadfin,scat.pesoini,scat.pesofin ' +
        'FROM llave lv INNER JOIN grado gr on gr.idgrado=lv.idgrado ' +
        'INNER JOIN categoria cat on cat.idcategoria=lv.idcategoria ' +
        'INNER JOIN subcategoria scat on scat.idsubcategoria=lv.idsubcategoria ' +
        'WHERE lv.tipo=? and lv.idcampeonato=? and lv.estado="A" ' +
        'UNION SELECT idllave,fecha,tipo,idgrado,genero,idcategoria,idsubcategoria,idcampeonato,estado,"EXHIBICIÓN","EXHIBICIÓN","EXHIBICIÓN",1,1,1,1 FROM llave where idgrado=-1 )res order by res.genero ;';
    var sql2 = 'SELECT res.idpelea,res.idpeleapadre,res.idllave,res.idcompetidor1,res.idcompetidor2,res.nropelea,res.idganador,res.idperdedor,res.nombres,res.apellidos,res.clubuno, ' +
        'res.idcinturon,res.cinturonuno,cm.idcinturon as idcinturondos,(select cin.nombre from cinturon cin where cin.idcinturon=cm.idcinturon)as cinturondos, ' +
        'cm.nombres as nombres2,cm.apellidos as apellidos2,(select cl.nombre from club cl where cl.idclub=cm.idclub) as clubdos FROM ' +
        '(SELECT p.idpelea,p.idpeleapadre,p.idllave,p.idcompetidor1,p.idcompetidor2,p.nropelea,p.idganador,p.idperdedor,c.nombres,c.apellidos,c.idcinturon, ' +
        '(select cin.nombre from cinturon cin where cin.idcinturon=c.idcinturon) as cinturonuno, ' +
        '(select cl.nombre from club cl where cl.idclub=c.idclub) as clubuno ' +
        'FROM pelea p inner join competidor c on c.idcompetidor=p.idcompetidor1) res ' +
        'INNER JOIN (select * from competidor union select 0,"SIN OPONENTE",null,null,null,null,null,null,null,null,null,null,"A",null,null) cm on cm.idcompetidor=res.idcompetidor2 where res.idllave=? order by res.nropelea ASC';
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.tipo, info.idCampeonato]);
        var resultado = []
        for (var llaves of result) {
            const [result] = await conn.query(sql2, [llaves.idllave])
            resultado.push({ ...llaves, "PELEAS": result })
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
    var sql = 'select * from llave where tipo=? and idcampeonato=? and idcategoria=? order by genero ;';
    var sql2 = 'select res.idpelea,res.idpeleapadre,res.idllave,res.idcompetidor1,res.idcompetidor2,res.nropelea,res.idganador,res.idperdedor,res.nombres,res.edad,res.peso,res.apellidos,res.clubuno,res.cinturonuno, ' +
        'c.nombres as nombres2,c.apellidos as apellidos2,(select cl.nombre from club cl where cl.idclub=c.idclub) as clubdos,(select cin.nombre from cinturon cin where cin.idcinturon=c.idcinturon) as cinturondos, ' +
        'c.peso as peso2,c.edad as edad2 ' +
        'from(select p.idpelea,p.idpeleapadre,p.idllave,p.idcompetidor1,p.idcompetidor2,p.nropelea,p.idganador,p.idperdedor,c.nombres,c.apellidos, ' +
        '(select cl.nombre from club cl where cl.idclub=c.idclub) as clubuno,c.edad,c.peso,genero, ' +
        '(select cin.nombre from cinturon cin where cin.idcinturon=c.idcinturon) as cinturonuno ' +
        'from pelea p inner join competidorsinpelea c on p.idcompetidor1=c.idcompetidor) res inner join (select * from competidorsinpelea union select 0,"SIN OPONENTE",null,null,null,null,null,null,null,null,null,null,"A",null,null) c on res.idcompetidor2=c.idcompetidor ' +
        'where res.idllave=? order by res.nropelea ASC;';
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.tipo, info.idCampeonato, info.idCategoria]);
        var resultado = []
        for (var llaves of result) {
            const [result] = await conn.query(sql2, [llaves.idllave])
            resultado.push({ ...llaves, "PELEAS": result })
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
    var sql = 'SELECT * FROM (SELECT *,(select nombre from club where idclub=c.idclub) as club, '+
        '(select nombre from cinturon where idcinturon=c.idcinturon) as cinturon, '+
        '(SELECT gr.nombre FROM grado gr inner join cinturon cin on cin.idgrado=gr.idgrado where cin.idcinturon=c.idcinturon) as grado, '+
        '(select cate.idcategoria from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin '+
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as idcategoria, '+
        '(select cate.nombre from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin '+
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as nombrecategoria, '+
        '(select subcate.idsubcategoria from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria '+
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as idsubcategoria, '+
        '(select subcate.nombre from categoria cate inner join subcategoria subcate on subcate.idcategoria=cate.idcategoria '+
        'where c.peso>=subcate.pesoini and c.peso<=subcate.pesofin and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato and c.edad>=cate.edadini and c.edad<=cate.edadfin and cate.idcampeonato=c.idcampeonato) as nombresubcategoria, '+
        "(concat_ws(' ', nombres, apellidos)) as nombrex "+
        "FROM competidor c WHERE c.tipo=?  and c.estado='A') as res where res.idcategoria in (select idcategoria from categoria where estado='A') and res.nombrex like '%"+info.competidor+"%'";
    var conn;
    try {
        console.log(sql);
        conn = await pool.getConnection();
        const [result] = await conn.query(sql, [info.tipo])
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

export const obtenerDatosPuntuados = async (info) => {
    console.log(info);
    var sql = 'select res.idclub,res.nombre,res.abreviado,count(ct.estado) as oro from (select cl.idclub,cl.nombre,cl.abreviado,(select cate.idcategoria from categoria cate where c.edad>=cate.edadini and c.edad<=cate.edadfin '+
        'and cate.genero=c.genero and cate.idcampeonato=c.idcampeonato) as idcategoria '+
        'from competidor c inner join club cl on cl.idclub=c.idclub where cl.puntuado="A" and c.estado="A" and c.idcampeonato=? and c.tipo=?) res inner join categoria ct on ct.idcategoria=res.idcategoria '+
        'where ct.estado="P" group by res.idclub ;'
    var sql2 = 'select csn.idclub,c.nombre,c.abreviado,count(csn.idclub) as oro from competidorsinpelea csn inner join club c on c.idclub=csn.idclub and c.puntuado="A" and csn.estado!="I" and csn.idcampeonato=? group by csn.idclub;'
    var conn;
    try {
        conn = await pool.getConnection();
        const [resultP] = await conn.query(sql, [info.idCampeonato,'P'])
        const [resultC] = await conn.query(sql, [info.idCampeonato,'C'])
        const [resultSN] = await conn.query(sql2,[info.idCampeonato])
        return { "ok": {"FP":resultP,"FC":resultC,'SNP':resultSN}}
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}