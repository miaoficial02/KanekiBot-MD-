import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return m.reply(`🎧 *Ejemplo de uso:* ${usedPrefix + command} shape of you`);
    }

    await m.react('🎵');

    const res = await fetch(`https://vihangayt.me/download/spotify?url=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.result || !json.result.audio) {
      return m.reply('❌ No se encontró la canción. Intenta con otro título o verifica el enlace.');
    }

    const { title, artists, thumbnail, audio } = json.result;

    let caption = `
╭━━━[ *𝐒𝐩𝐨𝐭𝐢𝐟𝐲 𝐌𝐮𝐬𝐢𝐜 🎧* ]━━⬣
┃ ✦ *Título:* ${title}
┃ ✦ *Artista(s):* ${artists.join(', ')}
┃ ✦ *Enlace:* ${text}
╰━━━━━━━━━━━━━━━━━━⬣
`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption,
      contextInfo: {
        externalAdReply: {
          title: '⎯ KanekiBot-MD ♫',
          body: 'Música descargada desde Spotify 🎧',
          thumbnailUrl: thumbnail,
          sourceUrl: text,
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true,
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      ptt: false
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.reply('❌ Ocurrió un error al procesar tu solicitud. Intenta más tarde.');
    await m.react('⚠️');
  }
};

handler.help = ['music <nombre/enlace>'];
handler.tags = ['descargas'];
handler.command = ['music', 'spotifydl'];

export default handler;
