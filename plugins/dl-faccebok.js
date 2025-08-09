import axios from 'axios';
import baileys from '@whiskeysockets/baileys';

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
        image: { url: 'https://i.imgur.com/3z7Zz9F.png' },
        caption: `🚫 El video no pudo ser enviado directamente.\n\n🔗 Puedes descargarlo manualmente:\n${videoUrl}\n\n≡ 🎬 \`Título :\` ${data.title || "Sin título"}\n≡ 📥 \`Calidad :\` ${calidad}`,
        contextInfo: {
          externalAdReply: {
            title: "Facebook Downloader",
            body: "Ritual multimedia en curso...",
            thumbnailUrl: 'https://i.imgur.com/3z7Zz9F.png',
            sourceUrl: url,
            mediaType: 1,
            renderLargerThumbnail }
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
          thumbnailUrl: 'https://i.imgur.com/3z7Zz9F.png',
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    if (e.response?.status === 429) {
      return conn.sendMessage(m.chat, {
        image: { url: 'https://i.imgur.com/3z7Zz9F.png' },
        caption: `🚫 El servidor ha recibido demasiadas peticiones.\n\n🧘‍♂️ Espera unos minutos antes de intentar nuevamente.\n\n≡ 🔁 \`Código :\` 429 (Rate Limit)`,
        contextInfo: {
          externalAdReply: {
            title: "Facebook Downloader",
            body: "Demasiadas peticiones",
            thumbnailUrl: 'https://i.imgur.com/3z7Zz9F.png',
            sourceUrl: url,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    }

    return conn.sendMessage(m.chat, {
      image: { url: 'https://i.imgur.com/3z7Zz9F.png' },
      caption: `💥 Ocurrió un error inesperado al intentar descargar el video.\n\n≡ 🧩 \`Tipo :\` ${e.name}\n≡ 📄 \`Mensaje :\` ${e.message}`,
      contextInfo: {
        externalAdReply: {
          title: "Facebook Downloader",
          body: "Error inesperado",
          thumbnailUrl: 'https://i.imgur.com/3z7Zz9F.png',
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
  }
};

handler.help = ['fb'];
handler.command = ['fb', 'facebook'];
handler.tags = ['download'];

export default handler;