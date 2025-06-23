
let handler = async (m, { conn, participants }) => {
  let users = m.mentionedJid.filter(u => !conn.isOwner(u))
  let demotedUser = []
  for (let user of users)
    if (user.endsWith('@s.whatsapp.net') && (participants.find(v => v.id == user) || {}).admin) {
      const res = await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
      demotedUser.concat(res)
      await delay(1 * 1000)
    }
  m.reply(`✅ *Usuario(s) degradado(s) de admin*\n\n${demotedUser.map(v => '▢ @' + v.split('@')[0]).join('\n')}`, null, { mentions: demotedUser })
}

handler.help = ['demote @user']
handler.tags = ['grupo']
handler.command = ['demote', 'degradar', 'quitaradmin']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
