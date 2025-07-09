import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const thumbnailCard = 'https://qu.ax/VGCPX.jpg';

  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `🎧 *Proporcióname un nombre o enlace válido de Spotify.*\n\n📌 Ejemplo:\n${usedPrefix + command} Kill Bill - SZA\n${usedPrefix + command} https://open.spotify.com/track/6UR5tB1wVm7qvH4xfsHr8m`,
      contextInfo: {
        externalAdReply: {
          title: 'Spotify Downloader 🎵',
          body: 'Descarga cualquier canción fácil',
          thumbnailUrl: thumbnailCard,
          sourceUrl: 'https://api.vreden.my.id'
        }
      }
    }, { quoted: m });
  }

  try {
    // Buscar por nombre si no es link
    let spotifyUrl = text.includes('spotify.com/track')
      ? text
      : await getSpotifyLink(text);

    if (!spotifyUrl) return m.reply('❌ No se encontró ninguna canción con ese nombre.');

    // Obtener datos del track
    let res = await fetch(`https://api.vreden.my.id/api/spotify?url=${encodeURIComponent(spotifyUrl)}`);
    let json = await res.json();
    let track = json?.result;

    if (!track?.status || !track?.music) {
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
      contextInfo: {
        externalAdReply: {
          title: track.title,
          body: 'Spotify Downloader por Vreden',
          thumbnailUrl: track.cover || thumbnailCard,
          sourceUrl: track.music
        }
      }
    }, { quoted: m });

    const audioBuffer = await fetch(track.music).then(res => res.buffer());

    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      fileName: `${track.title}.mp3`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply(`💥 *Error descargando música.*\n🧾 Detalles: ${e.message}`);
  }
};

async function getSpotifyLink(query) {
  try {
    let res = await fetch(`https://api.vreden.my.id/api/search/spotify?query=${encodeURIComponent(query)}`);
    let json = await res.json();
    return json?.result?.[0]?.url || null;
  } catch {
    return null;
  }
}

handler.command = ['spotify', 'spotifytrack', 'songvreden'];
handler.help = ['spotify <nombre o link>'];
handler.tags = ['descargar'];

export default handler;
