import fetch from 'node-fetch';

const handler = async (m, { conn, args, command, usedPrefix }) => {
  const text = args.join(" ").trim();
  if (!text) {
    return conn.reply(
      m.chat,
      `╭─❖ 「 *💿 PLAY MUSIC* 」\n├ 🎵 *¿Qué deseas escuchar?*\n├ 📌 Usa: *${usedPrefix + command} Nombre de canción*\n╰───────────────⬣`,
      m
    );
  }

  // Enviamos un mensaje decorado sin miniatura
  await conn.reply(
    m.chat,
    `╭─❖ 「 *🔍 BUSCANDO...* 」\n├ 🎧 *Término:* ${text}\n├ ⏳ Espera mientras se procesa\n╰───────────────⬣`,
    m
  );

  try {
    // 1) Buscar en YouTube para obtener el link (por si es útil)
    const searchRes = await fetch(`https://api.dorratz.com/v3/yt-search?query=${encodeURIComponent(text)}`);
    const searchJson = await searchRes.json();

    let videoUrl = "https://youtube.com";
    if (searchJson?.data?.length > 0) {
      const video = searchJson.data[0];
      videoUrl = `https://youtu.be/${video.videoId}`;
    }

    // 2) Descargar audio desde la API
    const downloadRes = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
    const downloadJson = await downloadRes.json();

    if (!downloadJson.status || !downloadJson.result?.downloadUrl) {
      return conn.reply(m.chat, `❌ *No se encontró audio para:* "${text}"`, m);
    }

    const { title, artist, duration, cover } = downloadJson.result.metadata;
    const audio = downloadJson.result.downloadUrl;

    const caption = `
╭───「 *🎶 MÚSICA ENCONTRADA* 」──⬣
🔹 *Título:* ${title}
🔹 *Artista:* ${artist}
🔹 *Duración:* ${duration}
🔹 *Link YouTube:* ${videoUrl}
╰────────────────────────⬣
🎧 ¡Audio listo para reproducir!
    `.trim();

    // Enviar portada y datos
    await conn.sendMessage(m.chat, {
      image: { url: cover },
      caption: caption
    }, { quoted: m });

    // Enviar audio mp3
    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      fileName: `${title}.mp3`,
      mimetype: "audio/mp4",
      ptt: false
    }, { quoted: m });

  } catch (e) {
    console.error("⚠️ Error en Play:", e);
    return conn.reply(m.chat, `❌ *Error al descargar audio*\n\n🔧 ${e.message}`, m);
  }
};

handler.command = /^play2$/i;
handler.tags = ['download'];
handler.help = ['play <nombre de canción/artista>'];
export default handler;
