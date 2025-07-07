import fg from 'api-dylux';

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    if (!args[0]) {
      return respuestaMini(conn, m, `🥀 Ingresa un enlace válido de TikTok\n\n> *B𝐲 𝐁𝐚𝐣𝐨𝐁𝐨𝐭𝐬*`);
    }

    if (!/(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi.test(text)) {
      return respuestaMini(conn, m, `❎ Enlace de TikTok inválido.`);
    }

    m.react('🕒');

    let data = await fg.tiktok(args[0]);
    let { title, play, duration } = data.result;
    let { nickname } = data.result.author;

    let caption = `
乂 *TikTok Download*

◦ 👤 *Autor:* ${nickname}
◦ 📌 *Título:* ${title}
◦ ⏱️ *Duración:* ${duration}`.trim();

    
    m.react('✅');
  } catch (e) {
    return respuestaMini(conn, m, `❌ *Error:* ${e.message}`);
  }
};

handler.help = ["tiktok"];
handler.tags = ["download"];
handler.command = ["tt", "tiktok", "ttdl"];
export default handler;
