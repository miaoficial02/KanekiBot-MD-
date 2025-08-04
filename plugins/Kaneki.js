import fetch from 'node-fetch';

const handler = async (m, { conn, command }) => {
  const videoUrl = 'https://files.catbox.moe/vx01o1.jpg'; // 🔁 Aquí puedes poner tu propio link MP4
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
        jpegThumbnail: await (await fetch('https://iili.io/F8Y2bS9.jpg')).buffer()
      }
    }
  };

  await conn.sendMessage(m.chat, {
    video: { url: videoUrl },
    gifPlayback: true,
    caption: caption
  }, { quoted: fkontak });
};

handler.command = ['kaneki'];
handler.tags = [];
handler.help = ['kaneki'];

export default handler;
