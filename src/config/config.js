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
        user:'root',
        password:'usbw',
        database: 'tkdb',
        host: 'localhost',
        port:3306,
        waitForConnections: true,
        connectionLimit: 20,
        queueLimit: 0
    },
    NOMBREAPP:"SISTEMA TKD V.1"
}