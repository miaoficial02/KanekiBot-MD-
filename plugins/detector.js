conn.ev.on('groups.update', async (updates) => {
  for (const update of updates) {
    const id = update.id;
    const newSubject = update.subject;
    const actor = update.subjectOwner;

    if (!newSubject || !actor) return; 

    const pp = await conn.profilePictureUrl(id, 'image').catch(() => 'https://iili.io/F8Y2bS9.jpg');
    const groupMetadata = await conn.groupMetadata(id);
    const memberCount = groupMetadata.participants.length;
    const name = await conn.getName(actor);

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

    const caption = `
╭━━〔 *🌐 NOMBRE DEL GRUPO CAMBIADO* 〕━━⬣
┃ 📛 *Nuevo nombre:* ${newSubject}
┃ 🧑‍💼 *Por:* @${actor.split('@')[0]} (${name})
┃ 👥 *Miembros:* ${memberCount}
╰━━━━━━━━━━━━━━━━━━━━⬣`.trim();

    await conn.sendMessage(id, {
      image: { url: pp },
      caption,
      mentions: [actor]
    }, { quoted: fkontak });
  }
});
