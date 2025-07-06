import { PornHub } from 'pornhub.js';
import fs from 'fs';
import { exec } from 'child_process';
import crypto from "crypto";

let handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `🔍 *Ejemplo de uso:*\n\n.phub sweetie fox`, m);
    }

    const ph = new PornHub();
    m.react('🔄');

    if (text.includes('pornhub.com/view_video.php?')) {
      const dl = await ph.video(text);
      const resolution = dl.mediaDefinitions.find(f => f.format === 'hls' && (f.quality === 480 || f.quality === 720));

      if (!resolution) {
        return conn.reply(m.chat, '⚠️ No se encontró una resolución válida para descargar.', m);
      }

      let cap = `
┏━━━━━━━━━━━━━━⬣
┃ 🍑 𝐏𝐎𝐑𝐍𝐇𝐔𝐁 - 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃
┗━━━━━━━━━━━━━━⬣

🎬 *Título:* ${dl.title}
⏱️ *Duración:* ${dl.durationFormatted}
👤 *Subido por:* ${dl.provider.username}
⭐ *Rating:* ${dl.vote.rating}
🏷️ *Tags:* ${dl.tags.slice(0, 4).join(', ')}
📂 *Categorías:* ${dl.categories.slice(0, 4).join(', ')}
🔗 *Link:* ${text}

⏳ *Descargando el archivo...*
`.trim();

      m.reply(cap);

      const m3u8Url = resolution.videoUrl;
      const fileName = crypto.randomBytes(2).toString('hex') + '.mp4';
      const outputPath = `./downloads/${fileName}`;
      
      if (!fs.existsSync('./downloads')) fs.mkdirSync('./downloads');

      const ffmpegCommand = `ffmpeg -i "${m3u8Url}" -c copy -bsf:a aac_adtstoasc "${outputPath}"`;

      exec(ffmpegCommand, async (error, stdout, stderr) => {
