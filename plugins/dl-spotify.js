import axios from 'axios';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🎧 *Ingresa el nombre o enlace de una canción de Spotify*\n\n📌 *Ejemplo:* ${usedPrefix + command} kill bill sza\n📌 *Ejemplo:* ${usedPrefix + command} https://open.spotify.com/track/...`);
  }

  try {
    let spotifyUrl = '';
    
    if (text.includes('spotify.com')) {
      // Si es un enlace directo de Spotify
      spotifyUrl = text;
    } else {
      // Si es una búsqueda por nombre → buscar en API de búsqueda
      let search = await axios.get(`https://zenzxz.dpdns.org/downloader/spotify`, {
        params: { query: text }
      });

      let first = search?.data?.result?.[0];
      if (!first || !first.url) return m.reply('❌ No se encontraron resultados en Spotify.');

      spotifyUrl = first.url;
    }

    // Descargar usando el enlace obtenido
    let res = await axios.get(`https://zenzxz.dpdns.org/downloader/spotify`, {
      params: { url: spotifyUrl }
    });

    let { result } = res.data;

    if (!result || !result.status) {
      return m.reply('❌ No se pudo obtener la canción. Asegúrate de que el enlace o nombre sea válido.');
    }

    let { title, artists, releaseDate, type, cover, music } = result;

    let info = `
🎧 *Título:* ${title}
👤 *Artista:* ${artists}
📀 *Tipo:* ${type}
🗓️ *Lanzamiento:* ${releaseDate || 'No disponible'}
`.trim();

    await conn.sendMessage(m.chat, { image: { url: cover }, caption: info }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: music },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Error al procesar la canción. Intenta con otro nombre o enlace.');
  }
};

handler.help = ['spotify'].map(v => v + ' <nombre|link>');
handler.tags = ['descargar'];
handler.command = /^spotify$/i;

export default handler;
