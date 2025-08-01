import fetch from 'node-fetch';

const handler = async (m, { conn, participants, isAdmin, isOwner, text }) => {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.');
  if (!(isAdmin || isOwner)) return m.reply('👮 Solo *admins* pueden usar este comando.');

  const mensaje = text || '*🌐 MENSAJE GENERAL DEL GRUPO:*';

  const texto = `
╭─❖ 「 📢 *MENCIÓN GLOBAL* 」 ❖─
│ 👀 *Mensaje:* ${mensaje}
│ 👥 *Miembros:* ${participants.length}
╰──────────────⬣

${participants.map(p => `👤 @${p.id.split('@')[0]}`).join('\n')}

╭───────────────•
│ 『 ᴋ ᴀ ɴ ᴇ ᴋ ɪ ʙ ᴏ ᴛ 』
╰───────────────•`.trim();

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: "MENCIÓN COMPLETA🥷🔥",
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

  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: participants.map(p => p.id)
  }, { quoted: fkontak });
};

handler.help = ['tagall [texto]'];
handler.tags = ['group'];
handler.command = ['tagall', 'todos', 'etiquetartodos'];

handler.group = true;
handler.admin = true;

export default handler;
