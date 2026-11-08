import {DB_HOST,DB_NAME,DB_PASSWORD,PORT,
DB_PORT,DB_USER,NAME_SERVER,BOT_TOKEN,CHAT_ID,
CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,
CLOUDINARY_API_SECRET} from './configDeploy.js';

export const configuraciones = {
    PORT:PORT,
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
    BOT_TOKEN:BOT_TOKEN,
    CHAT_ID:CHAT_ID,
    CLOUDINARY_CLOUD_NAME:CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:CLOUDINARY_API_SECRET
}