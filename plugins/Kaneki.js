import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  const videoUrl = 'https://files.catbox.moe/vx01o1.jpg';

  const caption = `
🎥 *KANEKI INFERNAL* 👁‍🗨
━━━━━━━━━━━━━━━━━━━━━━
⚔️ *KanekiBot-MD* siempre presente...
💠 ¡Disfruta del poder de la oscuridad!
━━━━━━━━━━━━━━━━━━━━━━
`.trim();

  const fkontak = {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'Halo'
    },
    message: {
      locationMessage: {
        name: 'KANEKI DIOS',
        vcard:
          'BEGIN:VCARD\n' +
          'VERSION:3.0\n' +
          'N:;Unlimited;;;\n' +
          'FN:Unlimited\n' +
          'ORG:Unlimited\n' +
          'TITLE:\n' +
          'item1.TEL;waid=19709001746:+1 (970) 900-1746\n' +
          'item1.X-ABLabel:Unlimited\n' +
          'X-WA-BIZ-DESCRIPTION:ofc\n' +
          'X-WA-BIZ-NAME:Unlimited\n' +
          'END:VCARD'
      }
    },
    participant: '0@s.whatsapp.net'
  };

  await conn.sendMessage(m.chat, {
    video: { url: videoUrl },
    gifPlayback: true,
    caption: caption
  }, {
    quoted: fkontak
  });
};


handler.customPrefix = /^kaneki$/i;
handler.command = new RegExp();
handler.before = true;

export default handler;
