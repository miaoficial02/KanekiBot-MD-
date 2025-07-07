import { igdl } from 'ruhend-scraper'

const handler = async (m, { text, conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, ` Por favor, ingresa un enlace de Facebook.`)
  }

  let res;
  try {
    await m.react(rwait);
    res = await igdl(args[0]);
  } catch (e) {
    return conn.reply(m.chat, ` Error al obtener datos. Verifica el enlace.`)
  }

  let result = res.data;
  if (!result || result.length === 0) {
    return conn.reply(m.chat, ` No se encontraron resultados.`)
  }

  let data;
  try {
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
  } catch (e) {
    return conn.reply(m.chat, ` Error al procesar los datos.`)
  }

  if (!data) {
    return conn.reply(m.chat, `No se encontró una resolución adecuada.`)
  }

  let video = data.url;
  try {
    await conn.sendMessage(m.chat, { video: { url: video }, caption: `${emoji} Aqui tienes ฅ^•ﻌ•^ฅ.`, fileName: 'fb.mp4', mimetype: 'video/mp4' }, { quoted: m })
    await m.react(done);
  } catch (e) {
    return conn.reply(m.chat, ` Error al enviar el video.`)
    await m.react(error);
  }
}

handler.help = ['facebook', 'fb']
handler.tags = ['descargas']
handler.command = ['facebook', 'fb']
handler.group = true;
handler.register = false;
handler.coin = 2;

export default handler
