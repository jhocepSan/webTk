import {configuraciones} from './config/config.js'
import app from './utils/app.js';
import {pool} from './utils/connection.js';
import path from 'path'

async function InitServer() {
    console.log(configuraciones.NOMBREAPP, '....');
    try {
        console.log("Iniciando la Conección de la base de datos ONLINE ...");
        await pool.getConnection()
    } catch (error) {
        console.log("Error en la conneccion : " + error);
        //await db.closeConnection();
    }

    try {
        console.log("Iniciando servidor ....")
        app.listen(app.get('port'),()=>{
            console.log('funcionando servidos en puerto '+ app.get('port'));
        });
    } catch (error) {
        console.log("Error iniciar Servidor : " + error)
    }
}

InitServer()