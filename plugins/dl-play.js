import yts from "yt-search";
import fetch from "node-fetch";

const limit = 100; // Límite de peso en MB
const APIKEY = "Sylphiette's"; // Tu API Key válida

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("🎧 *Usa el comando así:*\n> .play Never Gonna Give You Up");

  m.react("🎵");

  const res = await yts(text);
  if (!res || !res.all || res.all.length === 0) return m.reply("❌ No se encontraron resultados para tu búsqueda.");

  const video = res.all[0];

  // 🧾 Diseño estilo KanekiBot-MD
  const caption = `
╭══ 🎧 *KANEKIBOT-MD | REPRODUCCIÓN* ══⬣
┃📌 *Título:* ${video.title}
┃🎙️ *Canal:* ${video.author.name}
┃⏱️ *Duración:* ${video.timestamp}
┃📊 *Vistas:* ${video.views.toLocaleString()}
┃🔗 *Enlace:* ${video.url}
╰━━━━━━━━━━━━━━━━━━━━⬣
🎧 *Procesando archivo...*
`.trim();

  // 🖼 Enviar miniatura con info
  await conn.sendMessage(m.chat, {
    image: { url: video.thumbnail },
    caption,
    contextInfo: {
      externalAdReply: {
        title: '🎶 Kaneki está trabajando...',
        body: 'Descarga en curso',
        thumbnailUrl: video.thumbnail,
        mediaType: 1,
        renderLargerThumbnail: false,
        sourceUrl: video.url,
        showAdAttribution: false,
      }
    }
  }, { quoted: m });

  // URL API
  const urlAudio = `https://api.sylphy.xyz/download/ytmp3?url=${encodeURIComponent(video.url)}&apikey=${APIKEY}`;
  const urlVideo = `https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(video.url)}&apikey=${APIKEY}`;

  try {
    if (command === "play") {
      const resApi = await fetch(urlAudio);
      const json = await resApi.json();

      if (!json.status || !json.res?.downloadURL) throw new Error("No se pudo obtener el audio");

      const audioUrl = json.res.downloadURL;
      const title = json.res.title || "audio";

      await conn.sendMessage(m.chat, {
        audio: { url: audioUrl },
        fileName: `${title}.mp3`,
        mimetype: "audio/mpeg"
      }, { quoted: m });

    } else if (command === "play2" || command === "playvid") {
      const resApi = await fetch(urlVideo);
      const json = await resApi.json();

      if (!json.status || !json.res?.url) throw new Error("No se pudo obtener el video");

      const videoUrl = json.res.url;
      const title = json.res.title || "video";

      const head = await fetch(videoUrl, { method: "HEAD" });
      const size = parseInt(head.headers.get("content-length") || "0");
      const sizemb = size / (1024 * 1024);
      const asDocument = sizemb >= limit;

      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        fileName: `${title}.mp4`,
        mimetype: "video/mp4"
      }, {
        quoted: m,
        ...(asDocument ? { asDocument: true } : {})
      });
    }

    await m.react("✅");

  } catch (err) {
    console.error(err);
    return m.reply(`❌ *Ocurrió un error:* ${err.message}`);
  }
};

handler.help = ["", "play2 <texto>"];
handler.tags = ["descargas"];
handler.command = ["play", "play2", "playvid"];

export default handler;
