import { pool } from '../utils/connection.js'

export const getUsuarios = async () => {
    var conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query('SELECT *,(select nombre from club where idclub=us.idclub)as club,(select nombre from cinturon where idcinturon=us.idcinturon)as cinturon FROM usuario us where us.estado!="E";')
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}
export const cambiarEstadoAlbitro = async (info) => {
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query('UPDATE usuario SET albitro=? WHERE idusuario=?;',
            [info.estado, info.idusuario])
        await conn.query('UPDATE mandopunto SET estado=? WHERE idusuario=?;',
            [info.estado, info.idusuario])
        await conn.commit();
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const cambiarEstadoUsuario = async (info) => {
    var conn;
    try {
        console.log(info);
        conn = await pool.getConnection();
        const [result] = await conn.query('UPDATE usuario SET estado=? WHERE idusuario=?;',
            [info.estado, info.idusuario])
        return { "ok": result }
    } catch (error) {
        console.log(error);
        return { "error": error.message }
    } finally {
        if (conn) { await conn.release(); }
    }
}

export const cargarAdjunto = async (data)=>{
    var sql = "INSERT INTO adjunto (tipo,ruta)"
    var conn;
    try {
        console.log(data,"info");
        var info = data.name.split('.');
        console.log(info);
        conn = await pool.getConnection();
        /*var result = await conn.execute(sql,[]);
        if(result.rowsAffected!=0){
            var nameImg = "ADJUNTO_"+regional+'_'+result.outBinds.V_ID+'.'+info[1];
            var rutaImg = path.join(__dirname,'../public/') + nameImg;
            if (fs.existsSync(rutaImg) == false) {
                var imagen = buffer.Buffer.from(data.data);
                imagen = imagen.toString('base64');
                await fs.writeFileSync(rutaImg, imagen, 'base64');
                await conn.commit();
                return {"ok":result.outBinds}
            }else{
                fs.unlink(rutaImg,function(err){
                    if(err) return console.log(err);
                    console.log(rutaImg,'Archivo Eliminado');
                });
                return {"error":"intente Nuevamente"}    
            }
        }else{
            return {"error":"intente Nuevamente"}
        }*/
        
        return {"ok":"guardado"}
    } catch (error) {
        console.log("error guardarFoto ", error);
        return {"error":error.message}
    }finally {
        if (conn) {
            await conn.close();
        }
    }
}