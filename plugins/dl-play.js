import fetch from 'node-fetch';

let handler = async (m, { conn, args, command, usedPrefix }) => {
  const text = args.join(" ");
  if (!text) {
    return m.reply(
      `┏━━━━━━━━━━━━━━⬣
┃🎧 *KANEKIBOT-MD - SPOTIFY PLAY*
┗━━━━━━━━━━━━━━⬣

🔎 *Uso correcto del comando:*
» ${usedPrefix + command} shakira soltera

© KanekiBot-MD`
    );
  }

  await m.react('🎧');

  try {
    const res = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.result?.downloadUrl) {
      return m.reply(
        `┏━━━━━━━━━━━━━━⬣
┃⚠️ *KANEKIBOT-MD - ERROR*
┗━━━━━━━━━━━━━━⬣

❌ No se encontró ningún resultado para:
» ${text}`
      );
    }

    const { title, artist, duration, cover, url } = json.result.metadata;
    const audio = json.result.downloadUrl;

    await conn.sendMessage(m.chat, {
      image: { url: cover },
      caption: `
┏━━━━━━━━━━━━━━⬣
┃🎵 *KANEKIBOT-MD - SPOTIFY*
┗━━━━━━━━━━━━━━⬣

🎶 *Título:* ${title}
👤 *Artista:* ${artist}
⏱️ *Duración:* ${duration}
🌐 *Spotify:* ${url}
`.trim()
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: 'audio/mp4',
      ptt: false,
      fileName: `${title}.mp3`
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    return m.reply(
      `┏━━━━━━━━━━━━━━⬣
┃⚠️ *KANEKIBOT-MD - ERROR*
┗━━━━━━━━━━━━━━⬣

❌ Ocurrió un error al procesar tu solicitud.
🔁 Intenta de nuevo más tarde.`
    );
  }
};

handler.help = ['play <nombre>'];
handler.tags = ['descargas'];
handler.command = /^play$/i;
handler.register = true;

export default handler;
