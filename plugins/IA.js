import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `⚠️ *Uso:* ${usedPrefix + command} <texto>`, m);

  const apiKey = 'bWF5dWxpcGFsbWEyMzRAZ21haWwuY29t:o8RUNwol2AqZOw4bcqOmT'; // 🔁 Reemplaza esto
  const imageUrl = 'https://cdn.d-id.com/assets/images/demo_female.jpg'; // ✅ Imagen segura

  try {
    const headers = apiKey.startsWith('did:') ? {
      'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      'Content-Type': 'application/json'
    } : {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    const res = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        source_url: imageUrl,
        script: {
          type: 'text',
          input: text,
          provider: { type: 'microsoft', voice_id: 'en-US-AriaNeural' },
          ssml: false
        }
      })
    });

    const data = await res.json();
    if (!data.id) throw new Error('No se pudo generar el video');

    let videoUrl;
    for (let i = 0; i < 15; i++) {
      const poll = await fetch(`https://api.d-id.com/talks/${data.id}`, { headers });
      const pollRes = await poll.json();
      if (pollRes.result_url) {
        videoUrl = pollRes.result_url;
        break;
      }
      await new Promise(res => setTimeout(res, 2000));
    }

    if (!videoUrl) throw new Error('El video tardó demasiado en generarse.');

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: `🎥 *Video generado con IA (D-ID)*\n\n🗣️ _${text}_`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, `❌ *Error:* ${e.message}`, m);
  }
};

handler.command = ['iavideo', 'talkai'];
handler.tags = ['ia'];
handler.help = ['iavideo <texto>'];

export default handler;
