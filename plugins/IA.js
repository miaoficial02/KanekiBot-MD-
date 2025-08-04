import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`⚠️ *Uso:* ${usedPrefix + command} <texto del video>`);

  const apiKey = global.bWF5dWxpcGFsbWEyMzRAZ21haWwuY29t:bWDLrdafrLv48LG6eWS0Q;
  if (!apiKey) return m.reply('❌ No se encontró la API KEY de D-ID. Agrégala como global.DID_API_KEY');

  const faceImage = 'https://iili.io/F8Y2bS9.jpg'; // Imagen frontal que "hablará"
  const voiceStyle = 'en-US'; // Puedes cambiar el idioma o estilo

  try {
    const createRes = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: text,
          provider: { type: 'microsoft', voice_id: 'en-US-JennyNeural' }, // Puedes usar otras voces
          ssml: false
        },
        source_url: faceImage,
        config: { fluent: true, pad_audio: 0.2 }
      })
    });

    const createJson = await createRes.json();
    if (!createJson.id) throw new Error('No se pudo crear el video. Verifica tu API Key y datos.');

    // Esperar que se genere el video
    let videoUrl;
    for (let i = 0; i < 20; i++) {
      await new Promise(res => setTimeout(res, 3000));
      const statusRes = await fetch(`https://api.d-id.com/talks/${createJson.id}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      const statusJson = await statusRes.json();
      if (statusJson.result_url) {
        videoUrl = statusJson.result_url;
        break;
      }
    }

    if (!videoUrl) throw new Error('⏱️ El video tardó demasiado o falló.');

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: `🎬 *Video generado por IA*\n🗣️ ${text}`,
      gifPlayback: false
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply(`❌ *Error generando el video IA:*\n${err.message}`);
  }
};

handler.help = ['aivideo'];
handler.tags = ['ia'];
handler.command = ['aivideo', 'videoia', 'iavideo'];

export default handler;
