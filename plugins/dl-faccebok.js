import axios from 'axios';
import baileys from '@whiskeysockets/baileys';

// No es necesario usar una miniatura predefinida, ya que la API nos proporciona una.
const THUMBNAIL_URL_DEFAULT = 'https://telegra.ph/file/a40498305f6e522915640.jpg';

// 🛡️ Función para enviar respuestas de error de forma consistente.
const responderError = async (conn, m, tipo, mensaje) => {
    await conn.sendMessage(m.chat, {
        caption: `💥 Error en el proceso: ${mensaje}\n\n≡ 🧩 \`Tipo :\` ${tipo}`,
    }, { quoted: m });
};

// 🤖 Lógica principal del plugin
let handler = async (m, { conn, args, usedPrefix, command }) => {
    const url = args?.[0];
    if (!url || !url.includes("facebook.com")) {
        return m.reply(`🧠 Por favor, ingresa un enlace válido de Facebook.\n\n📌 Ejemplo:\n${usedPrefix}${command} https://www.facebook.com/share/v/12DoEUCoFji/`);
    }

    m.react("🌀");

    try {
        const apiUrl = `https://api.dorratz.com/fbvideo?url=${encodeURIComponent(url)}`;
        const res = await axios.get(apiUrl);
        const videos = res.data;

        if (!Array.isArray(videos) || videos.length === 0) {
            m.react("❌");
            return m.reply(`⚠️ No se pudo encontrar un video en el enlace proporcionado. Intenta con otro.`);
        }

        // Seleccionamos la mejor calidad de video que tenga un enlace directo.
        // La API devuelve un array, iteramos sobre él para encontrar el mejor.
        const videoData = videos.find(v => v.resolution.includes('720p')) || videos[0];

        const videoUrl = videoData.url;
        const thumbnailUrl = videoData.thumbnail;
        const calidad = videoData.resolution;
        
        if (!videoUrl) {
            m.react("❌");
            return m.reply(`⚠️ La API no devolvió un enlace de video válido para la descarga.`);
        }

        // Enviamos el video al chat con la miniatura proporcionada por la API.
        await conn.sendMessage(m.chat, {
            video: { url: videoUrl, mimetype: 'video/mp4' },
            caption: `◜ Facebook Downloader ◞\n\n≡ 🎬 \`Calidad :\` ${calidad}\n≡ 🌐 \`Fuente :\` Facebook`,
            contextInfo: {
                externalAdReply: {
                    title: "Facebook Downloader",
                    body: "Descarga completada",
                    sourceUrl: url,
                    thumbnailUrl: thumbnailUrl,
                    mediaType: 1,
                    renderLargerThumbnail: true,
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
            mensaje = `La API respondió con un error: ${e.response.statusText}.`;
        } else if (e.request) {
            tipo = "Error de conexión";
            mensaje = "No se pudo conectar con el servidor de la API. Revisa tu conexión a internet.";
        } else {
            tipo = e.name || "Error inesperado";
            mensaje = e.message || "Ocurrió un problema. Intenta de nuevo.";
        }
        
        await responderError(conn, m, tipo, mensaje);
        console.error(`[FB-DL] Error capturado: ${tipo} → ${e.message}`);
    }
};

handler.help = ['fb <url>'];
handler.command = ['fb', 'facebook'];
handler.tags = ['download'];

export default handler;
