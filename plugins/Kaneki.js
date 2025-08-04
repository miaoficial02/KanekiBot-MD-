import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  const videoUrl = 'https://files.catbox.moe/vx01o1.mp4'; 
  const thumb = await (await fetch('https://iili.io/F8Y2bS9.jpg')).buffer();

  const caption = `
🎥 *KANEKI INFERNAL* 👁‍🗨
━━━━━━━━━━━━━━━━━━━━━━
⚔️ *KanekiBot-MD* siempre presente...
💠 ¡Disfruta del poder de la oscuridad!
━━━━━━━━━━━━━━━━━━━━━━
`.trim();

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Kaneki"
    },
    message: {
      locationMessage: {
        name: "Video especial: Kaneki 👾",
        jpegThumbnail: thumb
      }
    }
  };

  await conn.sendMessage(m.chat, {
    video: { url: videoUrl },
    gifPlayback: true,
    caption: caption
  }, { quoted: fkontak });
};

handler.customPrefix = /^kaneki$/i; 
handler.command = new RegExp(); 
handler.before = true;

export default handler;
