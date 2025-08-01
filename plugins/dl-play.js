import yt from 'yt-search';
import fetch from 'node-fetch';
import axios from 'axios';

const limit = 50 * 1024 * 1024; // 50 MB

export const command = ['play', 'play2'];
export const help = ['play', 'play2'];
export const description = '🌿 Buscar y descargar música o video desde YouTube.';

export async function run(ms, { sylph, command, prefix, text}) {
  if (!text) {
    return ms.reply(`╭━━〔 *⛩️ USO INCORRECTO* 〕━━⬣\n┃ ✦ Ejemplo: *${prefix + command} Tokyo Ghoul Opening*\n╰━━━━━━━━━━━━━━━━━━⬣`);
}

  const search = await yt.search(text);
  if (!search.videos.length) {
    return ms.reply('❌ No se encontró ningún video con ese nombre. Intenta con otro título.');
}

  const video = search.videos[0];

  const info = `
╭━━〔 *🎧 KANEKI PLAY* 〕━━⬣
┃ 🧿 *Título:* ${video.title}
┃ 🐙 *Autor:* ${video.author.name}
┃ ⏱️ *Duración:* ${video.timestamp}
┃ 🔥 *Vistas:* ${video.views.toLocaleString()}
┃ 🗓️ *Publicado:* ${video.ago}
┃ 🌐 *Enlace:* ${video.url}
╰━━━━━━━━━━━━━━━━━━⬣`;

  await ms.media(info.trim(), video.thumbnail);

  try {
    let url, title;

    if (command === 'play2') {
      const res = await fetch(`https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(video.url)}&apikey=sylphy`);
      const json = await res.json();

      if (!json.status ||!json.res?.url) {
        return ms.reply('⚠️ No se pudo obtener el video. Intenta con otro enlace.');
}

      url = json.res.url;
      title = json.res.title;
} else {
      const result = await (await fetch(`https://api.sylphy.xyz/download/ytmp3?url=${video.url}&apikey=sylphy`)).json();
      if (!result.res.url) {
        return ms.reply('⚠️ No se pudo obtener el audio. Intenta más tarde.');
}

      url = result.res.url;
      title = result.res.title;
}

    const fileRes = await fetch(url);
    const buffer = await fileRes.arrayBuffer();

    if (command === 'play2') {
      if (buffer.byteLength> limit) {
        await ms.sendDoc(title, title, url);
} else {
        await ms.sendVideo(title, url);
}
} else {
      await ms.sendAudio(title, url);
}

} catch (err) {
    console.error(`❌ Error al descargar ${command}:`, err);
    ms.reply(`❌ *Error al descargar el ${command === 'play2'? 'video': 'audio'}.*\n🔧 Detalles: ${err.message}`);
}
}
```
