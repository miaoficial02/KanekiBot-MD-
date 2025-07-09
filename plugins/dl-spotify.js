import axios from 'axios';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🎧 *Ingresa el enlace de una canción de Spotify*\n\n📌 *Ejemplo:* ${usedPrefix + command} https://open.spotify.com/track/509f8c7db081751fa290bea82eadb956`);
  }

  try {
    let res = await axios.get(`https://api.vreden.my.id/api/dowloader/spotify`, {
      params: { url: text }
    });

    let { result } = res.data;

    if (!result || !result.status) {
      return m.reply('❌ No se pudo obtener la canción. Asegúrate de que el enlace es válido.');
    }

    let { title, artists, releaseDate, type, cover, music } = result;

    let info = `
🎧 *Título:* ${title}
👤 *Artista:* ${artists}
📀 *Tipo:* ${type}
🗓️ *Lanzamiento:* ${releaseDate}
`.trim();

    await conn.sendMessage(m.chat, { image: { url: cover }, caption: info }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: music },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Error al descargar la canción. Intenta con otro enlace.');
  }
};

handler.help = ['spotify'].map(v => v + ' <link>');
handler.tags = ['descargar'];
handler.command = /^spotify$/i;

export default handler;
