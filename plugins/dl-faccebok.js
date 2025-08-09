import axios from 'axios';
import baileys from '@whiskeysockets/baileys';

// 🖼 Imagen en base64 para evitar errores 429 de Imgur
const iconoFB = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADh..."; // tu base64 aquí

// 🛡️ Función auxiliar para respuestas rituales de error
function responderError(conn, m, tipo, mensaje, url) {
  return conn.sendMessage(m.chat, {
    image: { url: iconoFB },
    caption: `💥 ${mensaje}\n\n≡ 🧩 \`Tipo :\` ${tipo}`,
    contextInfo: {
      externalAdReply: {
        title: "Facebook Downloader",
        body: tipo,
        thumbnailUrl: iconoFB,
        sourceUrl: url || 'https://facebook.com',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
}

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  const url = args[0];
  if (!url || !url.includes("facebook.com")) {
    return m.reply(`🧠 Ingresa un enlace válido de Facebook.\n\n📌 Ejemplo:\n${usedPrefix}${command} https://www.facebook.com/share/r/...`);
  }

  m.react("🌀");

  try {
    const res = await axios.get(`https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(url)}`);
    const data = res.data?.data;

    if (!data || !data.status || (!data.hd_url && !data.sd_url)) {
      return conn.reply(m.chat, `⚠️ No se pudo obtener el video. Intenta con otro enlace.`, m);
    }

    const videoUrl = data.hd_url || data.sd_url;
    const calidad = data.hd_url ? "HD" : "SD";

    const check = await axios.head(videoUrl).catch(() => null);
    if (!check || !check.headers['content-type']?.includes('video')) {
      return conn.sendMessage(m.chat, {
        image: { url: iconoFB },
        caption: `🚫 El video no pudo ser enviado directamente.\n\n🔗 Puedes descargarlo manualmente:\n${videoUrl}\n\n≡ 🎬 \`Título :\` ${data.title || "Sin título"}\n≡ 📥 \`Calidad :\` ${calidad}`,
        contextInfo: {
          externalAdReply: {
            title: "Facebook Downloader",
            body: "Descarga alternativa disponible",
            thumbnailUrl: iconoFB,
            sourceUrl: url,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    }

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: `◜ Facebook Downloader ◞\n\n≡ 🎬 \`Título :\` ${data.title || "Sin título"}\n≡ 📥 \`Calidad :\` ${calidad}\n≡ 🌐 \`Fuente :\` Facebook`,
      contextInfo: {
        externalAdReply: {
          title: "Facebook Downloader",
          body: "Descarga ritual completada",
          thumbnailUrl: iconoFB,
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    try {
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch { /* silencio */ }

  } catch (e) {
    const status = e.response?.status;
    const tipo = e.name || "Error desconocido";
    const mensaje = status === 429
      ? "🚫 El servidor ha recibido demasiadas peticiones. Espera unos minutos antes de intentar nuevamente.\n\n≡ 🔁 Código: 429 (Rate Limit)"
      : status
        ? `⚠️ Error HTTP ${status}. La API respondió con un problema.`
        : "⚠️ Ocurrió un error inesperado. Puede ser de red, formato o envío.";

    await responderError(conn, m, tipo, mensaje, url);

    // 🔹 Log resumido (sin imprimir AxiosError entero)
    console.error(`[FB-DL] Error capturado: ${tipo} (${status || 'sin código'}) → ${e.message}`);
  }
};

handler.help = ['fb'];
handler.command = ['fb', 'facebook'];
handler.tags = ['download'];

export default handler;