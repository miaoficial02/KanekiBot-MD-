import render from '../lib/welcome.js'

let handler = async (m, { conn }) => {} // vacío, solo eventos automáticos

handler.before = async function (m, { conn }) {
  if (!m.isGroup || !m.messageStubType) return

  const id = m.chat
  const groupMetadata = await conn.groupMetadata(id).catch(_ => null)
  if (!groupMetadata) return

  const participants = m.messageStubParameters || []
  const isWelcome = m.messageStubType === 27 // add
  const isBye = m.messageStubType === 32 // remove
  const users = participants.map(id => id.split('@')[0])
  const groupName = groupMetadata.subject

  for (const user of users) {
    const pp = await conn.profilePictureUrl(user + '@s.whatsapp.net', 'image').catch(() => null)
    const name = await conn.getName(user + '@s.whatsapp.net')

    // Cargar fondo desde memoria personalizada o usar default
    const background = global.db.data.chats[id]?.[isWelcome ? 'welcomeImage' : 'byeImage'] || 'https://qu.ax/UwNas.jpg'

    const text = isWelcome
      ? `🌸 *¡Hola @${user}!* Bienvenido/a a *${groupName}* 🎉\nNo olvides leer las reglas y presentarte.`
      : `👋 *@${user} ha salido de ${groupName}.*\nLe deseamos lo mejor. 🌱`

    const title = isWelcome ? '𝙀𝙉𝙏𝙍𝘼𝘿𝘼 𝘼𝙇 𝙂𝙍𝙐𝙋𝙊' : '𝙎𝘼𝙇𝙄𝘿𝘼 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊'

    const imgBuffer = await render({
      wid: user,
      pp: pp || null,
      name,
      text,
      title,
      background,
    })

    await conn.sendMessage(id, {
      image: imgBuffer,
      caption: text,
      mentions: [user + '@s.whatsapp.net']
    })
  }
}

export default handler
