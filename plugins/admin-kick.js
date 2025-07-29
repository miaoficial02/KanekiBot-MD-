import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {

  if (!m.mentionedJid[0] && !m.quoted) return m.reply(`✳️ Ingresa el tag de un usuario. Ejemplo :\n\n*${usedPrefix + command}* @tag`)

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
  if (conn.user.jid.includes(user)) return m.reply(`✳️ No puedo hacer un auto kick`)

  await conn.groupParticipantsUpdate(m.chat, [user], 'remove')

  // Descarga la miniatura desde una URL
  let thumbnail = await axios.get('https://qu.ax/VGCPX.jpg', { responseType: 'arraybuffer' })

  await conn.sendMessage(m.chat, {
    text: `✅ Usuario eliminado con éxito`,
    contextInfo: {
      externalAdReply: {
        title: 'KANEKIBOT-MD ⚙️',
        body: 'BOT OFICIAL • By BajoBots',
        mediaType: 1,
        renderLargerThumbnail: true,
        thumbnail: Buffer.from(thumbnail.data), // Aquí va la miniatura en formato binario
        sourceUrl: 'https://github.com/kleiner1-1'
      }
    }
  }, { quoted: m })
const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: "𝖬𝖤𝖭𝖴 𝖢𝖮𝖬𝖯𝖫𝖤𝖳𝖮 👾",
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


handler.help = ['kick @user']
handler.tags = ['group']
handler.command = ['kick', 'expulsar']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
