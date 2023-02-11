import {pool} from '../utils/connection.js'

export const getCampeonato = async()=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('SELECT * FROM tkdb.campeonato ORDER BY idcampeonato DESC;')
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}

export const getCategoria = async (info)=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('SELECT * FROM tkdb.categoria where genero=? and idcampeonato=? order by edadini;',
        [info.genero,info.campeonato.idcampeonato])
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}

export const getConfiCategoria = async(info)=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('SELECT * FROM tkdb.categoria where genero=? and idcampeonato=? order by edadini;',
        [info.genero,info.idcampeonato]);
        var information=[]
        for (var categoria of result){
            const [result] = await conn.query('SELECT * FROM tkdb.subcategoria where idcategoria=? order by pesoini;',[categoria.idcategoria])
            information.push({...categoria,'SUBCATEGORIA':result})
        }
        return {"ok":information}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}

export const addCategoria = async ({info})=>{
    var conn;
    try {
        conn =await pool.getConnection();
        if(info.selectCategoria.idcategoria===undefined){
            const [result] = await conn.query('INSERT INTO tkdb.categoria (nombre,edadini,edadfin,idcampeonato,genero) value (?,?,?,?,?);',
                [info.nombre,info.edadIni,info.edadFin,info.idcampeonato,info.genero])
            return {"ok":result}
        }else{
            const [result] = await conn.query('UPDATE tkdb.categoria SET nombre=?,edadini=?,edadfin=?,idcampeonato=?,genero=? WHERE idcategoria=?;',
                [info.nombre,info.edadIni,info.edadFin,info.idcampeonato,info.genero,info.selectCategoria.idcategoria])
            return {"ok":result}
        }
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}

export const deleteCategoria = async ({info})=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('DELETE FROM tkdb.categoria WHERE idcategoria=?;',[info.dato.idcategoria]);
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}

export const addSubCategoria = async ({info})=>{
    var conn;
    try {
        conn =await pool.getConnection();
        if(info.selectSubCategoria.idsubcategoria===undefined){
            const [result] = await conn.query('INSERT INTO tkdb.subcategoria (idcategoria,nombre,pesoini,pesofin) value (?,?,?,?);',
                [info.idCategoria,info.nombre,info.pesoIni,info.pesoFin])
            return {"ok":result}
        }else{
            const [result] = await conn.query('UPDATE tkdb.subcategoria SET nombre=?,pesoini=?,pesofin=? WHERE idcategoria=? and idsubcategoria=?;',
                [info.nombre,info.pesoIni,info.pesoFin,info.idCategoria,info.selectSubCategoria.idsubcategoria])
            return {"ok":result}
        }
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}

export const getSubCategoria = async ({info})=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('SELECT * FROM tkdb.subcategoria where idcategoria=? order by pesoini;',[info.idcategoria])
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}
export const addGrado=async({info})=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('INSERT INTO tkdb.grado (nombre,tipo,idcampeonato) values (?,?,?);',[info.nombre,info.tipo,info.idcampeonato]);
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}
export const getGrados=async({info})=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('SELECT idgrado,nombre,tipo FROM tkdb.grado where estado="A" and idcampeonato=? and tipo=?;',[info.idcampeonato,info.tipo]);
        if(result.length!==0){
            var resultado=[];
            for await(var dato of result){
                let [result] = await conn.query('SELECT idcinturon,nombre FROM tkdb.cinturon where idgrado=? ;',[dato.idgrado])
                resultado.push({...dato,"cinturon":result});
            }
            return {"ok":resultado}
        }
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}
export const deleteGrado=async({info})=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('UPDATE tkdb.grado set estado="E" where idgrado=?;',[info.idgrado]);
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}
export const addCinturon=async({info})=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('INSERT INTO tkdb.cinturon (nombre,idgrado) values (?,?);',[info.nombre,info.idgrado]);
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}
export const deleteCinturon=async({info})=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('delete from tkdb.cinturon where idcinturon=?;',[info.idcinturon]);
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}
export const deleteSubcategoria=async(info)=>{
    var conn;
    try {
        conn =await pool.getConnection();
        const [result] = await conn.query('delete from tkdb.subcategoria where idsubcategoria=?;',[info.idsubcategoria]);
        return {"ok":result}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}