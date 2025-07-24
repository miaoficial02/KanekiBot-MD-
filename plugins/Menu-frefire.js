// comando: ffmenu.js
import moment from 'moment-timezone';

let handler = async (m, { conn, usedPrefix }) => {
  const taguser = '@' + m.sender.split('@')[0];
  const date = moment.tz('America/Bogota').format('DD/MM/YYYY');
  const time = moment.tz('America/Bogota').format('HH:mm:ss');

  let menu = `
╭━〔 𓆩 👾 𝐊𝐀𝐍𝐄𝐊𝐈𝐁𝐎𝐓-𝐕𝟐 👾 𓆪 〕━╮
┃🌐 *Menú Free Fire | FF*
┃━━━━━━━━━━━━━━━━━━
┃📅 *Fecha:* ${date}
┃🕒 *Hora:* ${time}
┃👤 *Usuario:* ${taguser}
╰━━━━━━━━━━━━━━━━━━╯

🪓 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 𝐃𝐄 𝐅𝐑𝐄𝐄 𝐅𝐈𝐑𝐄 🎮

┏––––––––––––––––––––––⬣
┃🎯 ${usedPrefix}ffid *<tu id de Free Fire>*
┃🪙 ${usedPrefix}ffreclamar
┃🎁 ${usedPrefix}ffdaily
┃🛍️ ${usedPrefix}fftienda
┃🎲 ${usedPrefix}ffroll
┃🏆 ${usedPrefix}ffranking
┃👑 ${usedPrefix}ffperfil
┗––––––––––––––––––––––⬣

🎮 *Aprovecha tus recompensas y presume tus logros con estilo.*

💎 *Bot por @kleiner1-1*
`.trim();

  await conn.sendMessage(m.chat, {
    video: { url: 'https://files.catbox.moe/mlp65k.mp4' },
    caption: menu,
    gifPlayback: true,
    contextInfo: {
      mentionedJid: [m.sender]
    }
  }, { quoted: m });
};

handler.help = ['ffmenu'];
handler.tags = ['freefire'];
handler.command = ['ffmenu'];

export default handler;
