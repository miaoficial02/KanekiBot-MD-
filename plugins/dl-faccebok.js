import axios from 'axios';
import baileys from '@whiskeysockets/baileys';

// No se usa la miniatura.
const THUMBNAIL_URL = '';

// 🛡️ Función para enviar respuestas de error sin miniatura.
const responderError = async (conn, m, tipo, mensaje, url) => {
    await conn.sendMessage(m.chat, {
        caption: `💥 Error en el proceso: ${mensaje}\n\n≡ 🧩 \`Tipo :\` ${tipo}`,
        contextInfo: {
            externalAdReply: {
                title: "Facebook Downloader",
                body: tipo,
                sourceUrl: url || 'https://facebook.com',
                // No se incluye thumbnailUrl ni mediaType para evitar errores.
            }
        }
    }, { quoted: m });
};

// 🤖 Lógica principal del plugin
let handler = async (m, { conn, args, usedPrefix, command }) => {
    const url = args?.[0];
    if (!url || !url.includes("facebook.com")) {
        return m.reply(`🧠 Por favor, ingresa un enlace válido de Facebook.\n\n📌 Ejemplo:\n${usedPrefix}${command} https://www.facebook.com/share/r/1B5sDSg6EU/`);
    }

    m.react("🌀");

    try {
        const apiUrl = `https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(url)}`;
        const res = await axios.get(apiUrl);
        const data = res.data?.data;

        if (!data?.status || (!data.hd_url && !data.sd_url)) {
            m.react("❌");
            return m.reply(`⚠️ No se pudo encontrar un video en el enlace proporcionado. Intenta con otro.`);
        }

        const videoUrl = data.hd_url || data.sd_url;
        const calidad = data.hd_url ? "HD" : "SD";

        console.log(`[FB-DL] Intentando enviar el video desde la URL: ${videoUrl}`);

        await conn.sendMessage(m.chat, {
            video: { url: videoUrl, mimetype: 'video/mp4' },
            caption: `◜ Facebook Downloader ◞\n\n≡ 🎬 \`Título :\` ${data.title || "Sin título"}\n≡ 📥 \`Calidad :\` ${calidad}\n≡ 🌐 \`Fuente :\` Facebook`,
            contextInfo: {
                externalAdReply: {
                    title: "Facebook Downloader",
                    body: "Descarga completada",
                    sourceUrl: url,
                    // No se incluye thumbnailUrl ni mediaType para evitar errores.
                }
            }
        }, { quoted: m });

        m.react("✅");

    } catch (e) {
        m.react("❌");
        
        let mensaje = "Ocurrió un error inesperado al procesar tu solicitud.";
        let tipo = "Error desconocido";

        if (e.response) {
            tipo = `Error HTTP ${e.response.status}`;
            if (e.response.status === 429) {
                mensaje = "Demasiadas peticiones. Intenta de nuevo en unos minutos.";
            } else {
                mensaje = "La API respondió con un error. Por favor, intenta de nuevo más tarde.";
            }
        } else if (e.request) {
            tipo = "Error de conexión";
            mensaje = "No se pudo conectar con el servidor de la API. Revisa tu conexión a internet.";
        } else {
            tipo = e.name || "Error inesperado";
            mensaje = e.message || "Ocurrió un problema. Intenta de nuevo.";
        }
        
        await responderError(conn, m, tipo, mensaje, url);
        console.error(`[FB-DL] Error capturado: ${tipo} → ${e.message}`);
    }
};

handler.help = ['fb <url>'];
handler.command = ['fb', 'facebook'];
handler.tags = ['download'];

export default handler;
