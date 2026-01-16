import {DB_HOST,DB_NAME,DB_PASSWORD,
DB_PORT,DB_USER,NAME_SERVER} from './configDeploy.js'
export const configuraciones = {
    CONFIGDBRED:{
        user:'vq7v81dtac95ini7cia5',
        password:'pscale_pw_XvYBfU0owhu9KedXr1CpprHeYAVrRRy7oUu4I6SkDnR',
        database: 'tkdb',
        host: 'us-east.connect.psdb.cloud',
        ssl:{
            rejectUnauthorized:false
        },
        waitForConnections: true,
        connectionLimit: 20,
        queueLimit: 0
    },
    CONFIGDBLOCAL:{
        user:DB_USER,
        password:DB_PASSWORD,
        database: DB_NAME,
        host: DB_HOST,
        port:DB_PORT,
        waitForConnections: true,
        connectionLimit: 20,
        queueLimit: 0
    },
    NOMBREAPP:"SISTEMA TKD V.1",
    NAMEPUBLIC:NAME_SERVER,
}