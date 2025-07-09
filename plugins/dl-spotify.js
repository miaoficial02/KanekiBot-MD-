import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const thumbnailCard = 'https://qu.ax/VGCPX.jpg';

  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `🎵 *Proporcióname un nombre o enlace válido de Spotify.*\n\n📌 *Ejemplo:* \n${usedPrefix + command} Kill Bill - SZA\n${usedPrefix + command} https://open.spotify.com/track/6UR5tB1wVm7qvH4xfsHr8m`,
      footer: '🎶 Plugin Spotify por Vreden API',
      contextInfo: {
        externalAdReply: {
          title: 'Descarga Spotify 🎶',
          body: 'Escucha y descarga canciones con solo un nombre o enlace',
          thumbnailUrl: thumbnailCard,
          sourceUrl: 'https://api.vreden.my.id'
        }
      }
    }, { quoted: m });
  }

  try {
    let spotifyURL = text;

    // Si no es un enlace, buscar por nombre
    if (!text.includes('spotify.com/track')) {
      const searchRes = await fetch(`https://api.vreden.my.id/api/search/spotify?query=${encodeURIComponent(text)}`);
      const searchJson = await searchRes.json();
      const result = searchJson?.result?.[0];

      if (!result || !result.url) {
        return m.reply('❌ No se encontraron resultados para ese nombre.');
      }

      spotifyURL = result.url;
    }

    // Obtener datos de la canción desde el link
    const api = `https://api.vreden.my.id/api/spotify?url=${encodeURIComponent(spotifyURL)}`;
    const res = await fetch(api);
    const json = await res.json();
    const track = json.result;

    if (!track?.status || !track.music) {
      return m.reply('❌ No se pudo obtener información del track. Verifica el enlace o nombre.');
    }

    const caption = `
╭━━━『 *SPOTIFY DOWNLOADER* 』━━━
┃🎧 *Título:* ${track.title}
┃👤 *Artista:* ${track.artists}
┃📀 *Tipo:* ${track.type}
┃🗓️ *Lanzamiento:* ${track.releaseDate || 'No disponible'}
╰━━━━━━━━━━━━━━━━━━━━━━━
🎶 *Enviando audio...*
`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: track.cover || thumbnailCard },
      caption,
      footer: '🎶 Música desde Vreden API',
      contextInfo: {
        externalAdReply: {
          title: track.title,
          body: 'Click para escuchar',
          thumbnailUrl: track.cover || thumbnailCard,
          sourceUrl: track.music
        }
      }
    }, { quoted: m });

    // Descargar audio
    const mp3Res = await fetch(track.music);
    const buffer = await mp3Res.buffer();

    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      fileName: `${track.title}.mp3`
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply(`💥 *Ocurrió un error descargando la canción.*\n📛 _Detalles:_ ${error.message}`);
  }
};

handler.command = ['spotify', 'trackvreden', 'songcard'];
handler.tags = ['descargar'];
handler.help = ['spotifyvreden <nombre|link>'];
export default handler;
