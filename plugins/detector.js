import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  
};

handler.groupUpdate = async (conn, { id, subject, actor }) => {
  try {
    const groupMetadata = await conn.groupMetadata(id);
    const pp = await conn.profilePictureUrl(id, 'image').catch(_ => 'https://iili.io/F8Y2bS9.jpg');
    const nombreActor = await conn.getName(actor);

    const mensaje = `
╭━━〔 *🌐 NOMBRE DEL GRUPO CAMBIADO* 〕━━⬣
┃ 📢 *Nuevo nombre:* ${subject}
┃ 🧑‍💼 *Modificado por:* @${actor.split('@')[0]} (${nombreActor})
┃ 👥 *Miembros:* ${groupMetadata.participants.length}
┃ 🕰️ *Hora:* ${new Date().toLocaleTimeString()}
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
          name: "*Kaneki Bot* 👾",
        //  jpegThumbnail: await (await fetch('https://iili.io/F8Y2bS9.jpg')).buffer(),
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
      caption: mensaje,
      mentions: [actor]
    }, { quoted: fkontak });

  } catch (e) {
    console.error('❌ Error al detectar cambio de nombre:', e);
  }
};

export default handler;
