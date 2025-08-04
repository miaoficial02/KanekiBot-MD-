import fetch from 'node-fetch';

let handler = async (m, { conn }) => {}

handler.groupUpdate = async (conn, { id, subject, actor }) => {
  try {
    const pp = await conn.profilePictureUrl(id, 'image').catch(() => 'https://iili.io/F8Y2bS9.jpg');
    const groupMetadata = await conn.groupMetadata(id);
    const participants = groupMetadata.participants || [];
    const memberCount = participants.length || 0;
    const name = await conn.getName(actor);

    const text = `
╭━━〔 *🌐 CAMBIO DE NOMBRE DETECTADO* 〕━━⬣
┃ 📛 *Nuevo nombre:* ${subject}
┃ 🧑‍💼 *Cambiado por:* @${actor.split('@')[0]} (${name})
┃ 👥 *Miembros:* ${memberCount}
┃ ⏱️ *Hora:* ${new Date().toLocaleTimeString()}
╰━━━━━━━━━━━━━━━━━━━━⬣`.trim();

    const fkontak = {
      key: {
        participants: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        fromMe: false,
        id: "Halo"
      },
      message: {
        locationMessage: {
          name: "*Kaneki Bot*👾",
          jpegThumbnail: await (await fetch('https://iili.io/F8Y2bS9.jpg')).buffer(),
          vcard:
            "BEGIN:VCARD\n" +
            "VERSION:3.0\n" +
            "N:;Unlimited;;;\n" +
            "FN:Unlimited\n" +
            "ORG:Unlimited\n" +
            "TITLE:\n" +
            "item1.TEL;waid=19709001746:+1 (970) 900-1746\n" +
            "item1.X-ABLabel:Unlimited\n" +
            "X-WA-BIZ-DESCRIPTION:ofc\n" +
            "X-WA-BIZ-NAME:Unlimited\n" +
            "END:VCARD"
        }
      },
      participant: "0@s.whatsapp.net"
    };

    await conn.sendMessage(id, {
      image: { url: pp },
      caption: text,
      mentions: [actor]
    }, { quoted: fkontak });

  } catch (e) {
    console.error('[❌ Error al enviar notificación de nombre]', e);
  }
};

export default handler;
