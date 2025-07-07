import fetch from "node-fetch";
import yts from "yt-search";

const handler = async (m, { conn, text }) => {
  if (!text.trim()) {
    return conn.reply(m.chat, `🧃 *Usa el comando así:*\n> .play [nombre de la canción o artista]`, m);
  }

  try {
    await conn.sendMessage(m.chat, {
      text: `🎧 *Buscando tu música...*\nEspera un momento, Kaneki está cazando melodías en la red 🎭`,
      contextInfo: {
        externalAdReply: {
          thumbnailUrl: 'https://qu.ax/RkiEC.jpg',
          mediaType: 1,
          renderLargerThumbnail: false,
          showAdAttribution: false,
          sourceUrl: ''
        }
      }
    }, { quoted: m });

    const search = await yts(text);
    const video = search?.videos?.[0];
    if (!video) return conn.reply(m.chat, `❌ *No encontré resultados para:* "${text}"`, m);

    const { title, thumbnail, timestamp, views, ago, url, author } = video;
    const canal = author?.name || "Desconocido";
    const thumb = (await conn.getFile(thumbnail))?.data;

    const info = `
╭━〔 *🎵 KANEKIBOT-MD - PLAY* 〕━⬣
┃📌 *Título:* ${title}
┃🎙️ *Canal:* ${canal}
┃⏱️ *Duración:* ${timestamp}
┃📊 *Vistas:* ${formatViews(views)}
┃📆 *Publicado:* ${ago}
┃🔗 *Link:* ${url}
╰━━━━━━━━━━━━⬣
🎧 *Descargando tu audio...*`.trim();

    await conn.sendMessage(m.chat, {
      text: info,
      contextInfo: {
        externalAdReply: {
          title: '🎶 Reproduciendo con KanekiBot',
          body: '',
          thumbnail: thumb,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: false,
          sourceUrl: url
        }
      }
    }, { quoted: m });

    const audio = await intentarDescargaDesdeApis(url);
    if (!audio) throw new Error("Todas las APIs fallaron al descargar.");

    await conn.sendMessage(m.chat, {
      audio: { url: audio.url },
      fileName: `${title}.mp3`,
      mimetype: "audio/mpeg"
    }, { quoted: m });

  } catch (err) {
    console.error("❌ Error en comando /play:", err);
    return conn.reply(m.chat, `❌ *Ocurrió un error al procesar tu solicitud.*\n🔧 ${err}`, m);
  }
};

handler.command = /^play$/i;
handler.tags = ["descargas"];
handler.help = ["play <nombre>"];
export default handler;

// 🌐 Múltiples APIs para MP3
async function intentarDescargaDesdeApis(videoUrl) {
  const apis = [
    (url) => `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(url)}`,
    (url) => `https://delirius-apiofc.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`,
    (url) => `https://api.starlights.uk/api/downloader/youtube?url=${encodeURIComponent(url)}`,
    (url) => `https://apis-starlights-team.koyeb.app/starlight/youtube-mp3?url=${encodeURIComponent(url)}`,
    (url) => `https://api.lolhuman.xyz/api/ytaudio?apikey=b8d3bec7f13fa5231ba88431&url=${encodeURIComponent(url)}`,
    (url) => `https://api.ryzumi.vip/api/downloader/ytmp3?url=${encodeURIComponent(url)}`,
  ];

  for (const construir of apis) {
    try {
      const res = await fetch(construir(videoUrl));
      const json = await res.json();

      const enlace =
        json?.result?.download?.url ||
        json?.result?.link ||
        json?.result?.url ||
        json?.url ||
        json?.data?.url;

      if (enlace && enlace.startsWith("http")) {
        return { url: enlace };
      }
    } catch (e) {
      console.warn("⚠️ API falló, intentando siguiente...");
    }
  }

  return null;
}

// 🔢 Formato de vistas
function formatViews(views) {
  if (!views) return "0";
  if (views >= 1e9) return (views / 1e9).toFixed(1) + "B";
  if (views >= 1e6) return (views / 1e6).toFixed(1) + "M";
  if (views >= 1e3) return (views / 1e3).toFixed(1) + "k";
  return views.toString();
                           }
