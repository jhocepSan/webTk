
import { configuraciones } from '../config/config.js'
class TelegramReport extends Error {
    constructor(message, tipo, detalles = null, stackOriginal = null) {
        super(message);
        this.name = this.constructor.name;
        this.tipo = tipo;
        this.detalles = detalles;
        
        // Guardamos el stack original o el de esta instancia
        this.stack = stackOriginal || this.stack;
        // Extraemos la ubicación exacta (archivo y línea)
        this.ubicacion = this.obtenerUbicacionExacta(this.stack);
    }

    // Extrae de forma limpia la primera línea de tu código que causó el fallo
    obtenerUbicacionExacta(stack) {
        if (!stack) return "Ubicación desconocida";
        
        const lineas = stack.split('\n');
        // Buscamos la primera línea del stack que haga referencia a tu carpeta /src/
        const lineaOrigen = lineas.find(linea => linea.includes('/src/') && !linea.includes('node_modules'));
        
        if (lineaOrigen) {
            // Limpiamos los paréntesis y espacios en blanco extras
            return lineaOrigen.replace('at ', '').trim();
        }
        
        return lineas[1] ? lineas[1].trim() : "Ubicación desconocida";
    }

    static catch(error) {
        if (error instanceof TelegramReport) return error;

        // Pasamos el error.stack original para no perder el rastro de la línea exacta
        if (error.code || error.errno || error.sqlState) {
            return new TelegramReport("Error en la operación de Base de Datos.", "DB_ERROR", {
                code: error.code,
                errno: error.errno,
                sqlMessage: error.message
            }, error.stack);
        }

        return new TelegramReport(error.message, "APP_ERROR", null, error.stack);
    }

    async enviarATelegram() {
        const BOT_TOKEN = configuraciones.BOT_TOKEN; 
        const CHAT_ID = configuraciones.CHAT_ID; 
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        // Construimos el mensaje de Telegram agregando la ubicación del error
        const mensaje = `
            🚨 *REPORTE DE ERROR EN SERVIDOR* 🚨
            ***Servidor ${configuraciones.NOMBREAPP} ***
            ****  Detalles  ****
            *Tipo:* \`${this.tipo}\`
            *Mensaje:* _${this.message}_

            📍 *📍 Ubicación del Fallo:*
            \`${this.ubicacion}\`

            ${this.detalles ? `*🗄️ Detalles Base de Datos:*
            • Código: \`${this.detalles.code || 'N/A'}\`
            • Mensaje DB: \`${this.detalles.sqlMessage || 'N/A'}\`` : '• _Error interno en lógica de JavaScript._'}
        `.trim();

        try {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: mensaje,
                    parse_mode: 'Markdown'
                })
            });
        } catch (telegramErr) {
            console.error("❌ No se pudo enviar el reporte a Telegram:", telegramErr.message);
        }
    }

    toResponse() {
        return {
            error: this.message,
            tipo: this.tipo,
            ubicacion: this.ubicacion,
            detalles: this.detalles
        };
    }
}

export default TelegramReport;
