
import {WAMessageStubType} from '@whiskeysockets/baileys'

export async function before(m, {conn, participants, groupMetadata}) {
  if (!m.messageStubType || !m.isGroup) return true
  let pp = 'https://i.ibb.co/rdTRKNk/avatar-contact.png'
  const groupName = groupMetadata.subject
  let text1 = `┌─⊷ *BIENVENIDO/A* 🎉\n`
  text1 += `▢ Grupo: ${groupName}\n`
  text1 += `▢ Usuario: @${m.messageStubParameters[0].split`@`[0]}\n`
  text1 += `▢ Fecha: ${new Date().toLocaleDateString()}\n`
  text1 += `▢ Hora: ${new Date().toLocaleTimeString()}\n`
  text1 += `└─⊷ *LEE LAS REGLAS DEL GRUPO* 📖`

  let text2 = `┌─⊷ *DESPEDIDA* 👋\n`
  text2 += `▢ Grupo: ${groupName}\n`
  text2 += `▢ Usuario: @${m.messageStubParameters[0].split`@`[0]}\n`
  text2 += `▢ Fecha: ${new Date().toLocaleDateString()}\n`
  text2 += `▢ Hora: ${new Date().toLocaleTimeString()}\n`
  text2 += `└─⊷ *HASTA PRONTO* 🌟`

  if (m.messageStubType == 27) {
    try {
      pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image')
    } catch (e) {} finally {
      const groupAdmins = participants.filter(p => p.admin)
      const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
      if (global.db.data.chats[m.chat].welcome) {
        conn.sendFile(m.chat, pp, 'welcome.jpg', text1, m, false, {mentions: [m.messageStubParameters[0]]})
      }
    }
  }

  if (m.messageStubType == 28) {
    try {
      pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image')
    } catch (e) {} finally {
      if (global.db.data.chats[m.chat].welcome) {
        conn.sendFile(m.chat, pp, 'bye.jpg', text2, m, false, {mentions: [m.messageStubParameters[0]]})
      }
    }
  }

  if (m.messageStubType == 32) {
    try {
      pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image')
    } catch (e) {} finally {
      if (global.db.data.chats[m.chat].welcome) {
        conn.sendFile(m.chat, pp, 'bye.jpg', text2, m, false, {mentions: [m.messageStubParameters[0]]})
      }
    }
  }
}
