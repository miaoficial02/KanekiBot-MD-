import fetch from 'node-fetch'

const handler = async (m, { isOwner, isAdmin, conn, text, participants, args }) => {
  let chat = global.db.data.chats[m.chat],
      emoji = chat.emojiTag || '👹'
  
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }

  const pesan = args.join` `
  const groupMetadata = await conn.groupMetadata(m.chat)
  const groupName = groupMetadata.subject

  const countryFlags = {
    '52': '🇲🇽', '57': '🇨🇴', '54': '🇦🇷', '34': '🇪🇸', '55': '🇧🇷',
    '1': '🇺🇸', '44': '🇬🇧', '91': '🇮🇳', '502': '🇬🇹', '56': '🇨🇱',
    '51': '🇵🇪', '58': '🇻🇪', '505': '🇳🇮', '593': '🇪🇨', '504': '🇭🇳',
    '591': '🇧🇴', '53': '🇨🇺', '503': '🇸🇻', '507': '🇵🇦', '595': '🇵🇾'
  }

  const getCountryFlag = (id) => {
    const phoneNumber = id.split('@')[0]
    let phonePrefix = phoneNumber.slice(0, 3)
    if (phoneNumber.startsWith('1')) return '🇺🇸'
    if (!countryFlags[phonePrefix]) phonePrefix = phoneNumber.slice(0, 2)
    return countryFlags[phonePrefix] || '🏳️‍🌈'
  }

  let teks = `*${groupName}*\n\n*Integrantes : ${participants.length}*\n${pesan}\n┌──⭓ *Despierten*\n`
  for (const mem of participants) {
    teks += `${emoji} ${getCountryFlag(mem.id)} @${mem.id.split('@')[0]}\n`
  }
  teks += `└───────⭓\n\n𝘚𝘶𝘱𝘦𝘳 _𝐬𝐮𝐩𝐞𝐫 Kaneki Bot👾`

  // 🧩 fkontak integrado aquí
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
  }

  await conn.sendMessage(m.chat, {
    text: teks,
    mentions: participants.map((a) => a.id)
  }, { quoted: fkontak })
}

handler.help = ['todos']
handler.tags = ['group']
handler.command = /^(tagall|invocar|marcar|todos|invocación)$/i
handler.admin = true
handler.group = true

export default handler
