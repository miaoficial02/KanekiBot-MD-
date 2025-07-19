import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const thumbnailCard = 'https://files.catbox.moe/he2fri.jpg';

  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `🎧 *Ingresa el nombre de una canción o un enlace válido de Spotify.*\n\n📌 *Ejemplo:* ${usedPrefix + command} DJ Opus`,
      footer: '🔍 Vreden API - Spotify Downloader',
      contextInfo: {
        externalAdReply: {
          title: 'Spotify Downloader 🎶',
          body: 'Busca y descarga cualquier canción',
          thumbnailUrl: thumbnailCard,
          sourceUrl: 'https://api.vreden.my.id'
        }
      }
    }, { quoted: m });
  }

  let trackUrl;

  // Detectar si es enlace Spotify
  const isSpotifyLink = text.includes('spotify.com/track');

  if (isSpotifyLink) {
    trackUrl = text.trim();
  } else {
    const searchUrl = `https://api.vreden.my.id/api/spotifysearch?query=${encodeURIComponent(text)}`;
    const searchRes = await fetch(searchUrl);
    const searchJson = await searchRes.json();

    if (!searchJson?.result || !searchJson.result[0]) {
      return m.reply(`❌ No se encontró ninguna canción con el nombre: *${text}*`);
    }

    trackUrl = searchJson.result[0].spotifyLink;
  }

  try {
    const infoRes = await fetch(`https://api.vreden.my.id/api/spotify?url=${encodeURIComponent(trackUrl)}`);
    const trackData = await infoRes.json();
    const track = trackData.result;

    if (!track?.status || !track.music) {
      return m.reply(`⚠️ No se pudo obtener datos válidos del track.`);
    }

    const audioRes = await fetch(track.music);
    const audioBuffer = await audioRes.buffer();

    // Diseño con marco
    const caption = `
╭━━━━〔 *SPOTIFY KANEKIBOT NO ME 🎧* 〕━━━━
┃🎵 *Título:* ${track.title}
┃👤 *Artista:* ${track.artists}
┃💽 *Tipo:* ${track.type}
┃📆 *Lanzamiento:* ${track.releaseDate || 'Desconocido'}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎧 *Enviando audio...*
`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: track.cover || thumbnailCard },
      caption,
      footer: '🟢 Música desde Vreden API',
      contextInfo: {
        externalAdReply: {
          title: track.title,
          body: 'Haz clic para escuchar o descargar',
          thumbnailUrl: track.cover || thumbnailCard,
          sourceUrl: track.music
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      fileName: `${track.title}.mp3`
    }, { quoted: m });

  } catch (err) {
    console.error('❌ Error:', err);
    m.reply(`💥 *Ocurrió un error al procesar tu solicitud.*\n📛 ${err.message}`);
  }
};

handler.command = ['spotify', 'trackvreden', 'songcard', 'buscaspotify'];
export default handler;
