import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🔊 *Uso:* ${usedPrefix + command} <texto para hablar>`, m);
  }

  const wait = await conn.sendMessage(m.chat, {
    text: '🎬 *Generando video IA, espera unos segundos...*'
  }, { quoted: m });

  try {
    const payload = {
      text: text,
      voice: 'en-US-JennyNeural',
      avatar_url: 'https://cdn.d-id.com/assets/images/demo_female.jpg' // Puedes usar otro link aquí
    };

    const res = await fetch('https://vidtalks.xyz/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();

    if (!json || !json.video_url) throw new Error('La API no devolvió el video.');

    await conn.sendMessage(m.chat, {
      video: { url: json.video_url },
      caption: `🎤 *Video generado con IA:*\n🗣️ _${text}_`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { delete: wait.key });
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `❌ *Error generando el video IA:*\n${e.message}`, m);
  }
};

handler.command = ['iavideo', 'talkai', 'videoia'];
handler.tags = ['ia'];
handler.help = ['iavideo <texto>'];

export default handler;
