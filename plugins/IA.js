import fetch from 'node-fetch';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`⚠️ *Uso:* ${usedPrefix + command} <texto para generar video IA>`);

  const id = Date.now();
  const audioPath = path.join(__dirname, `${id}.mp3`);
  const imgUrl = 'https://iili.io/F8Y2bS9.jpg'; // Imagen fondo (puedes cambiarla)
  const imgPath = path.join(__dirname, `${id}.jpg`);
  const videoPath = path.join(__dirname, `${id}.mp4`);

  try {
    m.react('🎙️');

    // Generar TTS con voz en español
    const ttsRes = await fetch(`https://api.ttsmp3.com/v1/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msg: text, lang: 'Conchita' }) // Voz española
    });
    const ttsJson = await ttsRes.json();

    if (!ttsJson.URL) throw '⚠️ Error generando audio';

    // Descargar audio y fondo
    const audioBuffer = await fetch(ttsJson.URL).then(res => res.buffer());
    const imgBuffer = await fetch(imgUrl).then(res => res.buffer());
    fs.writeFileSync(audioPath, audioBuffer);
    fs.writeFileSync(imgPath, imgBuffer);

    // Crear video con ffmpeg
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -loop 1 -i "${imgPath}" -i "${audioPath}" -c:v libx264 -c:a aac -b:a 192k -shortest -pix_fmt yuv420p "${videoPath}"`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Enviar video
    await conn.sendMessage(m.chat, {
      video: fs.readFileSync(videoPath),
      caption: `🎬 *Video generado IA*\n🗣️ Texto: _${text}_`,
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply('❌ *Ocurrió un error generando el video*');
  } finally {
    // Limpiar archivos
    [audioPath, imgPath, videoPath].forEach(f => fs.existsSync(f) && fs.unlinkSync(f));
  }
};

handler.command = ['aivideo'];
handler.help = ['aivideo <texto>'];
handler.tags = ['ia'];

export default handler;
