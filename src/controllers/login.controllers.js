import { pool } from '../utils/connection.js'
import { networkInterfaces } from 'os'
import bycript from 'bcrypt';

function getIPAddress() {
    var interfaces = networkInterfaces();
    console.log(interfaces);
    var address = []
    for (var devName in interfaces) {
        if(devName=='Wi-Fi' || devName=='eth0'){
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                address.push({name:devName,ip:alias.address});
        }
        }
    }
    return address;
}


export const agregarUsuario = async ({ info }) => {
    console.log(info);
    var conn;
    try {
        var newPassword = bycript.hashSync(info.password, 10);
        conn = await pool.getConnection();
        if(parseInt(info.idUsuario)==0){
            const [result] = await conn.query('SELECT idusuario from usuario where correo=?', [info.correo])
            if (result.length === 0) {
                const [rows] = await conn.query('INSERT INTO usuario (correo,password,nombres,apellidos,idclub,ci) values (?,?,?,?,?,?)', [
                    info.correo, newPassword, info.nombres, info.apellidos, info.idClub, info.ciUser
                ]);
                await conn.commit()
                return {
                    "ok": {
                        id: rows.insertId,
                        correo: info.correo,
                        nombres: info.nombres,
                        apellido: info.apellidos,
                        idclub: info.idClub
                    }
                }
            } else {
                return { "error": "Correo Existente" }
            }
        }else{
            const [rows] = await conn.query('update usuario set correo=?,nombres=?,apellidos=?,idclub=?,ci=? where idusuario=?', [
                info.correo, info.nombres, info.apellidos, info.idClub, info.ciUser,info.idUsuario
            ]);
            await conn.commit()
            return {"ok":"Competidor Actualizado"}
        }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const iniciarSession = async ({ correo, password }) => {
    var conn;
    var serverIp=getIPAddress();
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('select *,(select ruta from adjunto where idadjunto=foto)as foto from usuario where correo=? and estado!="E"', [correo.replace(' ', '')]);
        if (result.length !== 0) {
            if (bycript.compareSync(password.replace(' ', ''), result[0].password)) {
                return {
                    "ok": {
                        id: result[0].idusuario,
                        correo: result[0].correo,
                        nombres: result[0].nombres,
                        apellido: result[0].apellidos,
                        idclub: result[0].idclub,
                        tipo: result[0].estado,
                        foto:result[0].foto,
                        serverIp
                    }
                }
            }
        }
        return { "error": "Usuario o Contraseña No Validos" }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
async function getInfoCampeonato(conn,idcampeonato){
    try {
        const [info] = await conn.query('SELECT * FROM club where estado="A";')
        const [result] = await conn.query('SELECT idgrado,nombre,tipo FROM grado where estado="A" and idcampeonato=?',[idcampeonato]);
        if(result.length!==0){
            var resultado=[];
            for await(var dato of result){
                let [result] = await conn.query('SELECT idcinturon,nombre FROM cinturon where idgrado=? ;',[dato.idgrado])
                resultado.push({...dato,"cinturon":result});
            }
            return {"Grados":resultado,"club":info}
        }
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    } 
}
export const iniciarSessionMando = async ({correo,password})=>{
    var conn;
    try {
        conn =await pool.getConnection();
        var sql = "select *, "+
            "(select nombre from campeonato where estado='A' and idcampeonato=res.idcampeonato) as nombrecampeonato "+
            "from (select *,(select max(idcampeonato) from campeonato where estado='A') as idcampeonato from usuario where correo=? ) as res ;";
        const [result] = await conn.query(sql,[correo])
        if(result.length!==0){
            if(bycript.compareSync(password, result[0].password)){
                var info =await getInfoCampeonato(conn,result[0].idcampeonato);
                if(result[0].albitro=='A'){
                    await habilitarAlbitro(result[0],conn)
                }
                
                return {"ok":{
                    id:result[0].idusuario,
                    correo:result[0].correo,
                    nombres:result[0].nombres,
                    apellido:result[0].apellidos,
                    idclub:result[0].idclub,
                    idcampeonato:result[0].idcampeonato,
                    nombrecampeonato:result[0].nombrecampeonato,
                    albitro:result[0].albitro,
                    estado:result[0].estado,
                    ...info
                }}
            }
        }
        return {"error":"Usuario o Contraseña No Validos"}
    } catch (error) {
        console.log(error);
        return {"error":error.message}
    }finally{
        if(conn){await conn.release();}
    }
}
async function habilitarAlbitro(datos,conn){
    const [info] = await conn.query('SELECT * FROM mandopunto WHERE idusuario=?;',[datos.idusuario])
    if(info.length!=0){
        await conn.query('UPDATE mandopunto SET estado="A",tipoalbitro=? WHERE idusuario=?',[datos.tipoalbitro,datos.idusuario])
    }else{
        await conn.query('INSERT INTO mandopunto (idusuario,estado,tipoalbitro) values (?,?,?);',[datos.idusuario,datos.albitro,datos.tipoalbitro])
    }
    await conn.commit()
}
export const getIpServidor = async ()=>{
    try {
        var serverIp = getIPAddress();
        return {'ok':serverIp}
    } catch (error) {
        return {'error':error.message}
    }
}

export const crearCampeonato = async (info) => {
    var conn;
    try {
        var buf = Buffer.from(info.descripcion);
        conn = await pool.getConnection();
        const [result] = await conn.query('select * from campeonato where nombre=?', [info.nombre])
        if (result.length === 0) {
            const [rows] = await conn.query('insert into campeonato(nombre,descripcion) values(?,?)', [info.nombre, buf])
            if (info.importCat) {
                const [categorias] = await conn.query('SELECT * FROM categoria where estado!="E" and idcampeonato=? order by edadini;',
                    [info.importId]);
                for (var cat of categorias){
                    cat.idcampeonato=rows.insertId
                    var [newCat]=await conn.query('INSERT INTO categoria (nombre,edadini,edadfin,idcampeonato,genero) value (?,?,?,?,?);',
                    [cat.nombre,cat.edadini,cat.edadfin,cat.idcampeonato,cat.genero])
                    const [subCat] = await conn.query('SELECT * FROM subcategoria where idcategoria=? order by pesoini;', [cat.idcategoria])
                    for(var sbcat of subCat){
                        await conn.query('INSERT INTO subcategoria (idcategoria,nombre,pesoini,pesofin) value (?,?,?,?);',
                        [newCat.insertId,sbcat.nombre,sbcat.pesoini,sbcat.pesofin])
                    }
                }
            }
            if (info.importGrad) {
                const [grados] = await conn.query('SELECT idgrado,nombre,tipo FROM grado where estado="A" and idcampeonato=? ;',[info.importId]);
                console.log(grados);
                for (var grad of grados){
                    const [newGrad] = await conn.query('INSERT INTO grado (nombre,tipo,idcampeonato) values (?,?,?);',[grad.nombre,grad.tipo,rows.insertId]);
                    const [cinturones] = await conn.query('SELECT idcinturon,nombre FROM cinturon where idgrado=? ;',[grad.idgrado]);
                    for (var grd of cinturones){
                        const [result] = await conn.query('INSERT INTO cinturon (nombre,idgrado) values (?,?);',[grd.nombre,newGrad.insertId]);
                    }
                }
            }
            await conn.commit()
            return {
                "ok": {
                    id: rows.insertId
                }
            }
        }
        return { "error": "El nombre del campeonato ya existe ." }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const recuperarCuenta = async (info) => {
    var conn;
    try {
        var newPassword = bycript.hashSync(info.newPassword, 10);
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT idusuario from usuario where correo=? and ci=? and estado!="E"', [info.email, info.ci])
        console.log(result)
        if (result.length !== 0) {
            const [rows] = await conn.query('UPDATE usuario SET password=? WHERE idusuario=? and estado!="E"', [
                newPassword, result[0].idusuario
            ]);
            return { "ok": "Ingresa al sistemas con su nuevos datos, por favor ..." }
        } else {
            return { "error": "El correo o el ci, no existe en la cuenta, verifique por favor !!" }
        }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}