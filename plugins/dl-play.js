const yt = require('yt-search');
const fetch = require('node-fetch');
const axios = require('axios');

const limit = 50 * 1024 * 1024; // 50 MB

module.exports = {
  command: ['play', 'play2'],
  help: ["play", "play2"],
  description: "⚠️ Buscar y descargar música o video desde YouTube.",
  run: async (ms, { sylph, command, prefix, text }) => {
    if (!text) {
      return ms.reply(`😡 Uso correcto: ${prefix + command} Nombre del video`);
    }

    const search = await yt.search(text);
    if (!search.videos.length) {
      return ms.reply('🤷 No se encontró ningún video.');
    }

    const video = search.videos[0];

    const info = `
\`\`\`◜*Kaneki Play*◞\`\`\`

🥷 \`Título :\` ${video.title}
🔥 \`Autor :\` ${video.author.name}
💯 \`Duración :\` ${video.timestamp}
👀 \`Vistas :\` ${video.views.toLocaleString()}
⚠️ \`Publicado :\` ${video.ago}
♾️ \`Link :\` ${video.url}`;

    await ms.media(info, video.thumbnail);

    try {
      let url, title;

      if (command === 'play2') {
        const res = await fetch(`https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(video.url)}&apikey=sylphy`);
        const json = await res.json();

        if (!json.status || !json.res?.url) {
          return ms.reply('🥷 No se pudo obtener el enlace de video.');
        }

        url = json.res.url;
        title = json.res.title;
      } else {
        const result = await (await fetch(`https://api.sylphy.xyz/download/ytmp3?url=${video.url}&apikey=sylphy`)).json()
        if (!result.res.url) {
          return ms.reply('🥷 No se pudo obtener el enlace de audio.');
        }

        url = result.res.url;
        title = result.res.title;
      }

      const fileRes = await fetch(url);
      const buffer = await fileRes.buffer();

      if (command === 'play2') {
        if (buffer.length > limit) {
          await ms.sendDoc(title, title, url);
        } else {
          await ms.sendVideo(title, url);
        }
      } else {
        await ms.sendAudio(title, url);
      }

    } catch (err) {
      console.error(`🔥 Error al descargar ${command}:`, err);
      ms.reply(`🔥 Ocurrió un error al descargar el ${command === 'play2' ? 'video' : 'audio'}.\n${err.message}`);
    }
  }
};
