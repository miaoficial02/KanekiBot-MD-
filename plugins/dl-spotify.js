import fetch from 'node-fetch';
import { writeFileSync } from 'fs';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const thumbnailCard = 'https://qu.ax/VGCPX.jpg';

  if (!text || !text.includes('spotify.com/track')) {
    return conn.sendMessage(m.chat, {
      text: `🎵 *Proporcióname un enlace válido de Spotify.*\nEjemplo:\n${usedPrefix + command} https://open.spotify.com/track/XXXX`,
      footer: '🎶 Plugin Spotify por Vreden API',
      contextInfo: {
        externalAdReply: {
          title: 'Track Info de Spotify',
          body: 'Usa enlaces de Spotify para ver y descargar música',
          thumbnailUrl: thumbnailCard,
          sourceUrl: 'https://api.vreden.my.id'
        }
      }
    }, { quoted: m });
    return;
  }

  try {
    const api = `https://api.vreden.my.id/api/spotify?url=${encodeURIComponent(text)}`;
    const res = await fetch(api);
    const json = await res.json();
    const track = json.result;

    if (!track?.status || !track.music) {
      return m.reply('❌ No se pudo obtener información del track. Verifica el enlace.');
    }

    const mp3Res = await fetch(track.music);
    const buffer = await mp3Res.buffer();

    await conn.sendMessage(m.chat, {
      image: { url: track.cover || thumbnailCard },
      caption: `🎵 *${track.title}*\n👤 Artista: ${track.artists}\n📀 Tipo: ${track.type}\n📅 Lanzamiento: ${track.releaseDate || 'No disponible'}\n🎧 Enviando audio...`,
      footer: '🎶 Info obtenida vía Vreden API',
      contextInfo: {
        externalAdReply: {
          title: track.title,
          body: 'Click para escuchar o descargar',
          thumbnailUrl: thumbnailCard,
          sourceUrl: track.music
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      fileName: `${track.title}.mp3`
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply(`💥 Error al enviar la música.\n📛 Detalles: ${error.message}`);
  }
};

handler.command = ['spotify', 'trackvreden', 'songcard'];
export default handler;
