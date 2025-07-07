import { igdl } from 'ruhend-scraper';

const handler = async (m, { text, conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '*📌 Ingresa el link del video de Facebook.*', m);
  }

  // Reacción inicial
  await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    let res = await igdl(args[0]);
    let result = res.data;
    if (!result || result.length === 0) {
      return conn.reply(m.chat, '*⚠️ No se encontraron resultados para el enlace.*', m);
    }

    let data = result.find(i => i.resolution.includes('720p')) || result.find(i => i.resolution.includes('360p'));
    if (!data) {
      return conn.reply(m.chat, '*❌ No se encontró una resolución adecuada.*', m);
    }

    await conn.sendMessage(m.chat, {
      video: { url: data.url },
      caption: `🎬 *Facebook Video Descargado*\n📥 Resolución: ${data.resolution || 'Desconocida'}\n\nDescargado con *KanekiBot-MD*`,
      mimetype: 'video/mp4',
      fileName: 'fb.mp4',
    }, { quoted: m });

    // Reacción final
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error('Error al descargar:', error);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    return conn.reply(m.chat, `❎ *Ocurrió un error al procesar el enlace.*`, m);
  }
};

handler.help = ['fb *<link>*'];
handler.tags = ['downloader'];
handler.comman
