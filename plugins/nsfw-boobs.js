import axios from 'axios';

// 🤖 Lógica principal del plugin
let handler = async (m, { conn, args, usedPrefix, command }) => {
    // ⚠️ Revisa que el chat sea un grupo y que el modo NSFW esté habilitado.
    if (m.isGroup) {
        let isNsfw = global.db.data.chats[m.chat].isNsfw; // Suponiendo que tienes un sistema de base de datos para chats.
        if (!isNsfw) {
            return m.reply(`🚫 El comando ${usedPrefix + command} solo puede ser usado si el modo NSFW está activado en este grupo. \n\nPuedes activarlo con: ${usedPrefix}enable nsfw`);
        }
    } else {
        return m.reply('🚫 Este comando solo se puede usar en grupos.');
    }

    m.react("🔞");

    try {
        const apiUrl = `https://delirius-apiofc.vercel.app/nsfw/boobs`;
        const res = await axios.get(apiUrl);
        
        // Asumimos que la API devuelve una URL directa en la propiedad "url".
        const imageUrl = res.data?.url;

        if (!imageUrl) {
            m.react("❌");
            return m.reply(`⚠️ No se pudo obtener la URL de la imagen. La API no devolvió una URL válida.`);
        }

        // Enviar la imagen NSFW al chat.
        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: `Disfruta 🥵`,
        }, { quoted: m });

        m.react("✅");

    } catch (e) {
        m.react("❌");
        
        let mensaje = "Ocurrió un error inesperado al procesar tu solicitud.";
        let tipo = "Error desconocido";

        if (e.response) {
            tipo = `Error HTTP ${e.response.status}`;
            mensaje = `La API respondió con un error: ${e.response.statusText}.`;
        } else if (e.request) {
            tipo = "Error de conexión";
            mensaje = "No se pudo conectar con el servidor de la API. Revisa tu conexión a internet.";
        } else {
            tipo = e.name || "Error inesperado";
            mensaje = e.message || "Ocurrió un problema. Intenta de nuevo.";
        }
        
        await conn.reply(m.chat, `💥 Error: ${mensaje}\nTipo: ${tipo}`, m);
        console.error(`[NSFW] Error capturado: ${tipo} → ${e.message}`);
    }
};

handler.help = ['boobs'];
handler.command = ['boobs'];
handler.tags = ['nsfw'];

export default handler;
          
