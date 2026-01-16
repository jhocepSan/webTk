import {configuraciones} from './config/config.js'
import app from './utils/app.js';
import {pool} from './utils/connection.js';
import {Bonjour} from 'bonjour-service'
import path from 'path';
const instanceBonjour = new Bonjour(); 

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
        var port = app.get('port')
        app.listen(port,()=>{
            console.log('funcionando servidos en puerto '+ port);
            const service = instanceBonjour.publish({
                name: configuraciones.NAMEPUBLIC,
                type: 'http',                    
                port: port,                      
                txt: { txtvers: '1', user: 'admin' } 
            });

            console.log(`Servidor anunciado en la red local como: ${configuraciones.NOMBREAPP}.local`);

            service.on('error', (error) => {
                console.log("Error en publicación Bonjour:", error);
            });
        });
    } catch (error) {
        console.log("Error iniciar Servidor : " + error)
    }
}

InitServer()