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

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: `◜ Facebook Downloader ◞\n\n≡ 🎬 \`Título :\` ${data.title || "Sin título"}\n≡ 📥 \`Calidad :\` ${calidad}\n≡ 🌐 \`Fuente :\` Facebook`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    conn.reply(m.chat, `💥 Error al descargar el video:\n\n${e}`, m);
  }
};

handler.help = ['fb'];
handler.command = ['fb', 'facebook'];
handler.tags = ['download'];

export default handler;