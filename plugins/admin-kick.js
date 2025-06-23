
let handler = async (m, { conn, participants }) => {
  let users = m.mentionedJid.filter(u => !conn.isOwner(u))
  let kickedUser = []
  for (let user of users)
    if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => v.id == user) || {}).admin) {
      const res = await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
      kickedUser.concat(res)
      await delay(1 * 1000)
    }
  m.reply(`✅ *Usuario(s) expulsado(s)*\n\n${kickedUser.map(v => '▢ @' + v.split('@')[0]).join('\n')}`, null, { mentions: kickedUser })
}

handler.help = ['kick @user']
handler.tags = ['grupo']
handler.command = ['kick', 'expulsar']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
