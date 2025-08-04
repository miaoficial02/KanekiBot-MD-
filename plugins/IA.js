import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`✏️ *Uso correcto:*\n${usedPrefix + command} <texto para el video>`, m);

  try {
    await m.react('🎥');

    let wait = await conn.sendMessage(m.chat, {
      text: '🎬 *Generando tu video IA...* ⏳\n_Esto puede tardar unos segundos._'
    }, { quoted: m });

    // API FUNCIONAL: vidnoz AI video
    let res = await fetch(`https://vidnozai-api.vercel.app/api/ai?text=${encodeURIComponent(text)}`);
    if (!res.ok) throw '❌ Error en la API.';

    let json = await res.json();
    if (!json.status || !json.url) throw '❌ No se generó video válido.';

    await conn.sendMessage(m.chat, {
      video: { url: json.url },
      caption: `🎥 *Video IA generado:*\n🗣️ ${text}`,
      gifPlayback: false
    }, { quoted: m });

    await conn.sendMessage(m.chat, { delete: wait.key });

  } catch (e) {
    console.error(e);
    return m.reply(`❌ *Error generando el video IA:*\n${e.message || e}`);
  }
};

handler.help = ['aivideo'];
handler.tags = ['ia'];
handler.command = ['aivideo', 'videoai', 'iavideo'];

export default handler;
