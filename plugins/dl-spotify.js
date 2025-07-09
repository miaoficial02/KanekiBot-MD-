import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.includes('spotify.com/track/')) {
    return m.reply(
      `✨ *Usa un enlace válido de Spotify*\n\n` +
      `📌 *Ejemplo:* ${usedPrefix}${command} https://open.spotify.com/track/6UR5tB1wVm7qvH4xfsHr8m`
    );
  }

  await m.reply('*🔍 Buscando tu canción...*');

  try {
    let res = await axios.get(
      `https://api.dorratz.com/spotifydl`,
      { params: { url: text } }
    );

    let { status, title, artist, album, image, link } = res.data;

    if (!status || !link) {
      return m.reply('❌ No se pudo descargar la canción. Revisa el enlace.');
    }

    const caption =
      `╭━━━『 *🎶 SPOTIFY DOWNLOAD* 』━━━\n` +
      `┃ *Título:* ${title}\n` +
      `┃ *Artista:* ${artist}\n` +
      `┃ *Álbum:* ${album}\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━━`;

    await conn.sendMessage(
      m.chat,
      { image: { url: image }, caption },
      { quoted: m }
    );

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: link },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      },
      { quoted: m }
    );

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error descargando tu canción. Intenta más tarde.');
  }
};

handler.help = ['spotify'].map(v => v + ' <link>');
handler.tags = ['descargas'];
handler.command = /^spotify$/i;

export default handler;
