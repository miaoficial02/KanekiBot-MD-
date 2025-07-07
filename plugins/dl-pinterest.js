import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text, args }) => {
  if (!text) return m.reply(`🌺 *Ejemplo:* .pinterest Anime`);

  try {
    if (text.includes("https://")) {
      m.react("⏳");
      let i = await dl(args[0]);
      let isVideo = i.download.includes(".mp4");

      const fileType = isVideo ? "video" : "image";
      const content = {
        [fileType]: { url: i.download },
        caption: `🎀 *Pinterest Media*\n\n🔖 *Título:* ${i.title}`
      };

      await conn.sendMessage(m.chat, content, { quoted: m });
      return m.react("✅");
    }

    m.react("🕒");

    const results = await pins(text);
    if (!results.length) return conn.reply(m.chat, `🔍 No se encontraron resultados para: "${text}"`, m);

    const caption = `
╭─────〔 𝙋𝙄𝙉𝙏𝙀𝙍𝙀𝙎𝙏 - 𝙆𝘼𝙉𝙀𝙆𝙄𝘽𝙊𝙏 〕─────⬣
┃🔎 *Búsqueda:* "${text}"
┃📸 *Resultados:* ${results.length}
┃✨ *Mostrando los primeros 10...*
╰────────────────────────────⬣`.trim();

    const mediaList = results.slice(0, 10).map(img => ({
      type: 'image',
      data: { url: img.image_large_url }
    }));

    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: '🖼️ Pinterest Image Search',
          body: 'Resultados visuales encontrados',
          thumbnailUrl: results[0].image_large_url,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: 'https://pinterest.com',
        }
      }
    }, { quoted: m });

    // Enviar galería de imágenes
    for (let media of mediaList) {
      await conn.sendMessage(m.chat, {
        image: { url: media.data.url },
        caption: `🎴 *Resultado para:* ${text}`
      }, { quoted: m });
    }

    await m.react("✅");

  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, '❌ *Error al obtener imágenes de Pinterest.*', m);
  }
};

handler.help = ['pinterest <texto o link>'];
handler.command = ['pinterest', 'pin'];
handler.tags = ["descargas"];
export default handler;

// Función para obtener imagen o video desde link directo
async function dl(url) {
  try {
    let res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }).catch(e => e.response);
    let $ = cheerio.load(res.data);
    let tag = $('script[data-test-id="video-snippet"]');

    if (tag.length) {
      let result = JSON.parse(tag.text());
      return {
        title: result.name,
        download: result.contentUrl
      };
    } else {
      let json = JSON.parse($("script[data-relay-response='true']").eq(0).text());
      let result = json.response.data["v3GetPinQuery"].data;
      return {
        title: result.title,
        download: result.imageLargeUrl
      };
    }
  } catch {
    return { msg: "Error, inténtalo de nuevo más tarde" };
  }
}

// Función para obtener resultados por palabra clave
const pins = async (query) => {
  const link = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(query)}%26rs%3Dtyped&data=%7B%22options%22%3A%7B%22query%22%3A%22${encodeURIComponent(query)}%22%2C%22rs%22%3A%22typed%22%7D%7D`;
  
  const headers = {
    'user-agent': 'Mozilla/5.0',
    'x-requested-with': 'XMLHttpRequest',
    'x-app-version': 'c056fb7',
  };

  try {
    const res = await axios.get(link, { headers });
    const data = res.data.resource_response.data.results;

    return data.map(item => {
      if (item.images) {
        return {
          image_large_url: item.images.orig?.url || null,
        };
      }
      return null;
    }).filter(Boolean);
  } catch (error) {
    console.error('❌ Error al buscar en Pinterest:', error);
    return [];
  }
};
