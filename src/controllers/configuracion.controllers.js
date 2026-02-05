import { pool } from '../utils/connection.js'

export const getCampeonato = async () => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT * FROM campeonato ORDER BY idcampeonato DESC;')
        var resultado=[]
        for await (var cmp of result){
            const [snp] = await conn.query('select count(idcompetidor) sinpelea from competidorsinpelea where idcampeonato=? ',[cmp.idcampeonato])
            const [pomse] = await conn.query('select count(idcompetidor) as nump from competidor where idcampeonato=? and estado="A" and tipo="P";  ',[cmp.idcampeonato])
            const [kirugui] = await conn.query('select count(idcompetidor) as numk from competidor where idcampeonato=? and estado="A" and tipo="C"; ',[cmp.idcampeonato])
            resultado.push({...cmp,"SINPELEAS":snp[0].sinpelea,"NPP":pomse[0].nump,"NPK":kirugui[0].numk})
        }
        return { "ok": resultado }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const cambiarInscripcion = async(info)=>{
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('UPDATE campeonato SET inscripcion=? WHERE idcampeonato=?;',[info.estado,info.idCampeonato])
        return { "ok": "INSCRIPCIONES CAMBIADAS" }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getCategoria = async (info) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT * FROM categoria where genero=? and idcampeonato=? and tipo=? order by edadini;',
            [info.genero, info.campeonato.idcampeonato,info.tipo])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getConfiCategoriaFestival = async (info) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT * FROM categoria where estado="P" and genero=? and idcampeonato=? order by edadini;',
            [info.genero, info.idcampeonato]);
        var information = []
        for (var categoria of result) {
            const [result] = await conn.query('SELECT * FROM subcategoria where idcategoria=? order by pesoini;', [categoria.idcategoria])
            information.push({ ...categoria, 'SUBCATEGORIA': result })
        }
        return { "ok": information }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getConfiCategoria = async (info) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT * FROM categoria where estado="A" and genero=? and idcampeonato=? and tipo=? order by edadini;',
            [info.genero, info.idcampeonato,info.tipo]);
        var information = []
        for (var categoria of result) {
            const [result] = await conn.query('SELECT * FROM subcategoria where idcategoria=? order by pesoini;', [categoria.idcategoria])
            information.push({ ...categoria, 'SUBCATEGORIA': result })
        }
        return { "ok": information }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getConfiCategoriaUnido = async (info) => {
    var sql = `SELECT * FROM categoria where estado="A" and idcampeonato=? 
        union select -1,'Exibición',0,0,?,'F','A'
        union select -1,'Exibición',0,0,?,'M','A'
        order by genero,edadIni ;`
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql,
            [info.idcampeonato,info.idcampeonato,info.idcampeonato]);
        var information = []
        for (var categoria of result) {
            const [result] = await conn.query('SELECT * FROM subcategoria where idcategoria=? order by pesoini;', [categoria.idcategoria])
            information.push({ ...categoria, 'SUBCATEGORIA': result })
        }
        return { "ok": information }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const addCategoria = async ({ info }) => {
    var conn;
    try {
        conn = await pool.getConnection();
        if (info.selectCategoria.idcategoria === undefined) {
            const [result] = await conn.query('INSERT INTO categoria (nombre,edadini,edadfin,idcampeonato,genero,tipo) value (?,?,?,?,?,?);',
                [info.nombre, info.edadIni, info.edadFin, info.idcampeonato, info.genero,info.tipo])
            return { "ok": result }
        } else {
            const [result] = await conn.query('UPDATE categoria SET nombre=?,edadini=?,edadfin=?,idcampeonato=?,genero=?,tipo=? WHERE idcategoria=?;',
                [info.nombre, info.edadIni, info.edadFin, info.idcampeonato, info.genero,info.tipo, info.selectCategoria.idcategoria])
            return { "ok": result }
        }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const deleteCategoria = async ({ info }) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('DELETE FROM categoria WHERE idcategoria=?;', [info.dato.idcategoria]);
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const addSubCategoria = async ({ info }) => {
    var conn;
    try {
        conn = await pool.getConnection();
        if (info.selectSubCategoria.idsubcategoria === undefined) {
            const [result] = await conn.query('INSERT INTO subcategoria (idcategoria,nombre,pesoini,pesofin) value (?,?,?,?);',
                [info.idCategoria, info.nombre, info.pesoIni, info.pesoFin])
            return { "ok": result }
        } else {
            const [result] = await conn.query('UPDATE subcategoria SET nombre=?,pesoini=?,pesofin=? WHERE idcategoria=? and idsubcategoria=?;',
                [info.nombre, info.pesoIni, info.pesoFin, info.idCategoria, info.selectSubCategoria.idsubcategoria])
            return { "ok": result }
        }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const getSubCategoria = async ({ info }) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT * FROM subcategoria where idcategoria=? order by pesoini;', [info.idcategoria])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getGradoCompleto = async ({ info }) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [grados] = await conn.query('SELECT idgrado,nombre,tipo FROM grado where estado="A" and idcampeonato=? and tipo=?;', [info.idcampeonato, info.tipo]);
        const [result] = await conn.query('select * from tiposcampeonato where idcampeonato=? and tipo=? and estado="A";',[info.idcampeonato, info.tipo]);
        return { "ok":{'grados':grados,'tipocamp':result} }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const addGrado = async ({ info }) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('INSERT INTO grado (nombre,tipo,idcampeonato) values (?,?,?);', [info.nombre, info.tipo, info.idcampeonato]);
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getGrados = async ({ info }) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT idgrado,nombre,tipo FROM grado where estado="A" and idcampeonato=? and tipo=?;', [info.idcampeonato, info.tipo]);
        if (result.length !== 0) {
            var resultado = [];
            for await (var dato of result) {
                let [result] = await conn.query('SELECT idcinturon,nombre FROM cinturon where idgrado=? ;', [dato.idgrado])
                resultado.push({ ...dato, "cinturon": result });
            }
            return { "ok": resultado }
        }
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const deleteGrado = async ({ info }) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('UPDATE grado set estado="E" where idgrado=?;', [info.idgrado]);
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const addCinturon = async ({ info }) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('INSERT INTO cinturon (nombre,idgrado) values (?,?);', [info.nombre, info.idgrado]);
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const deleteCinturon = async ({ info }) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('delete from cinturon where idcinturon=?;', [info.idcinturon]);
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const deleteSubcategoria = async (info) => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('delete from subcategoria where idsubcategoria=?;', [info.idsubcategoria]);
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const cambiarEstadoCategoria = async (info) => {
    var conn;
    try {
        console.log(info)
        conn = await pool.getConnection();
        const [result] = await conn.query('update categoria set estado=? where idcategoria=? and idcampeonato=?;',
            [info.estado === 'A' ? 'P' : 'A', info.idcategoria, info.idcampeonato]);
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getTiposCampeonato = async (info) => {
    var conn;
    try {
        console.log(info)
        conn = await pool.getConnection();
        const [result] = await conn.query('select * from tiposcampeonato where idcampeonato=? and tipo=? and estado="A";',
            [info.idcampeonato, info.tipo]);
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const addTiposCampeonato = async (info) => {
    var conn;
    try {
        console.log(info)
        conn = await pool.getConnection();
        for await (var item of info.info) {
            if(parseInt(item.idtipo)==0){
                const [result] = await conn.query('INSERT INTO tiposcampeonato (idcampeonato,tipo,descripcion) values (?,?,?);',
                    [item.idcampeonato, item.tipo, item.descripcion]);
            }else{
                const [result] = await conn.query('UPDATE tiposcampeonato set idcampeonato=?,tipo=?,descripcion=? where idtipo=?',
                    [item.idcampeonato, item.tipo, item.descripcion,item.idtipo]);
            }
            await conn.commit();
        }
        return { "ok": "Guardado !!!" }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const deleteTiposCampeonato = async (info) => {
    var conn;
    try {
        console.log(info)
        conn = await pool.getConnection();
        const [result] = await conn.query("update tiposcampeonato set estado='E' where idtipo=? and idcampeonato=? and tipo=?",
            [info.idtipo,info.idcampeonato, info.tipo]);
        await conn.commit();
        return { "ok": "Eliminacion Correcta !!" }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const confiAreasKirugui = async(info)=>{
    var conn;
    try {
        var config = Buffer.from(JSON.stringify(info.conf))
        conn = await pool.getConnection();
        const [result] = await conn.query("select * from configuracion where id=?",
            [info.idConf]);
        if (result.length!=0){
            const [result] = await conn.query("update configuracion set nombre=?, config=? where id=?",
            [info.nombre,config,info.idConf]);
            await conn.commit();
            return {"ok":"Configuración Actualizada"}
        }else{
            const [result] = await conn.query("insert into configuracion values(?,?,?)",
            [info.idConf,info.nombre,config]);
            await conn.commit();
            return { "ok": "Configuración Agregada  !!" }
        }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const getConfiAreas = async(info)=>{
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query("select * from configuracion where id=?",
            [info.idConf]);
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const getCinturones = async (info)=>{
    const sql = `select idcinturon,nombre,colores,estado,
        case estado when 1 THEN 'Activo'
            when 2 THEN 'Inactivo'
        when 3 THEN 'Eliminado'
        else 'Otro' end as name_estado
        from cinturones where idclub=?;`
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql,[info.idclub]);
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const addCinturonClub = async(info)=>{
    const sql = `insert into cinturones (nombre,colores,idclub) values (?,?,?);`
    const sql1 = `update cinturones set nombre=?,colores=? where idcinturon=?`
    var conn;
    let resultado;
    try {
        console.log(info)
        conn = await pool.getConnection();
        if (info.idcinturon==0){
            const [result] = await conn.query(sql,[info.nombre,info.colores,info.idclub]);
            resultado = result;
        }else{
            const [result] = await conn.query(sql1,[info.nombre,info.colores,info.idcinturon]);
            resultado = result;
        }
        await conn.commit()
        return {"ok":resultado}
    } catch (error) {
        if (conn) await conn.rollback();
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const estadoCinturonClub=async(info)=>{
    console.log(info);
    const sql = `update cinturones set estado=? where idcinturon=?;`
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(sql,[info.estado,info.id]);
        await conn.commit()
        return {"ok":"Modificación correcta"}
    } catch (error) {
        if (conn) await conn.rollback();
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const editUbicacion = async (info)=>{
    console.log(info)
    const sql = `insert into ubicacion(latitud,longitud) values (?,?)`
    const sql2 = `update ubicacion set latitud=?,longitud=?,direccion=? where idubicacion=?`
    var conn;
    var resultado;
    try {
        conn = await pool.getConnection();
        if (info.idubicacion==undefined||parseInt(info.idubicacion)==0){
            const [result] = await conn.query(sql,[info.latitud,info.longitud]);
            resultado = result;
        }else{
            const [result] = await conn.query(sql2,[info.latitud,info.longitud,info.direccion,info.idubicacion]);
            resultado = result;
        }
        return {"ok":resultado}
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}