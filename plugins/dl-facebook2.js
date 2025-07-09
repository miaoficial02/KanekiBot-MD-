import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.includes('facebook.com')) {
    return m.reply(`📘 *Ingresa un enlace válido de Facebook*\n\n📌 *Ejemplo:* ${usedPrefix + command} https://www.facebook.com/share/v/1Bw2iFzHRd`);
  }

  await m.reply('🔄 *Procesando tu video...*');

  try {
    let res = await axios.get(`https://api.dorratz.com/v3/fb2`, {
      params: { url: text }
    });

    let data = res.data;

    if (!data || data.status === false || !data.url || !data.title) {
      return m.reply('❌ No se pudo obtener el video. Asegúrate que el enlace sea público.');
    }

    const { title, thumbnail, url } = data;

    const info = `
╭━❏ *📘 FACEBOOK DOWNLOADER v2*
┃📌 *Título:* ${title}
┃🎞️ *Calidad:* HD
┃🌐 *Dominio:* facebook.com
╰━━━━━━━━━━━━━━━━━━━`.trim();

    // Enviar miniatura con información
    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: info
    }, { quoted: m });

    // Enviar video
    await conn.sendMessage(m.chat, {
      video: { url },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Error al procesar el video. Intenta con otro enlace.');
  }
};

handler.help = ['facebook2', 'fb2'].map(v => v + ' <link>');
handler.tags = ['descargas'];
handler.command = /^facebook2|fb2$/i;

export default handler;
