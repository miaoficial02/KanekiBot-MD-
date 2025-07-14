import render from '../lib/welcome.js'

let handler = async (m, { conn }) => {} // vacío

handler.before = async function (m, { conn }) {
  if (!m.isGroup || !m.messageStubType) return

  const id = m.chat
  const group = await conn.groupMetadata(id).catch(() => null)
  if (!group) return

  const participants = m.messageStubParameters || []
  const isWelcome = m.messageStubType === 27 // add
  const isBye = m.messageStubType === 32 // remove

  if (!isWelcome && !isBye) return

  const chat = global.db.data.chats[id] || {}
  const fondo = isWelcome ? chat.welcomeImage : chat.byeImage
  const title = isWelcome ? '𝙀𝙉𝙏𝙍𝘼𝘿𝘼' : '𝙎𝘼𝙇𝙄𝘿𝘼'
  const short = isWelcome ? 'Bienvenido/a' : 'Adiós'

  for (const jid of participants) {
    try {
      const username = await conn.getName(jid)
      const pp = await conn.profilePictureUrl(jid, 'image').catch(() => null)

      const text = isWelcome
        ? `🌸 *${short} @${jid.split('@')[0]}*\n🎉 Te damos la bienvenida a *${group.subject}*\n📜 ¡Preséntate y lee las reglas!`
        : `👋 *${short} @${jid.split('@')[0]}*\n🌿 Ha salido de *${group.subject}*.\n✨ Que tengas buen viaje.`

      const img = await render({
        wid: jid,
        pp: pp,
        name: username,
        title,
        text,
        background: fondo || 'https://qu.ax/UwNas.jpg'
      })

      await conn.sendMessage(id, {
        image: img,
        caption: text,
        mentions: [jid]
      })

    } catch (e) {
      console.error('[Welcome/BYE Error]', e)
    }
  }
}

export default handler
