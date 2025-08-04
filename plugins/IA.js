import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `⚠️ *Uso:* ${usedPrefix + command} <texto del video>`, m);

  try {
    let wait = await conn.sendMessage(m.chat, { 
      text: '⏳ *Generando tu video con IA, espera un toque...*' 
    }, { quoted: m });

    let url = `https://api.nekorinn.my.id/ai-vid/videogpt?text=${encodeURIComponent(text)}`;
    let res = await fetch(url);

    if (!res.ok) throw new Error(`Error en API: ${res.status} ${res.statusText}`);

    let buffer = await res.buffer();

    await conn.sendMessage(m.chat, { 
      video: buffer, 
      caption: `🎬 *Video generado:* ${text}\n\n_Por ${globalThis.botname}_`, 
      gifPlayback: false 
    }, { quoted: m });

    await conn.sendMessage(m.chat, { delete: wait.key });
  } catch (e) {
    await conn.reply(m.chat, `❌ *Error generando el video:* \n${e.message || e}`, m);
  }
};

handler.help = ['aivideo'];
handler.tags = ['ia'];
handler.command = ['aivideo', 'videoai', 'iavideo'];

export default handler;
