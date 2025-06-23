
let handler = async (m, { conn, participants }) => {
  let users = m.mentionedJid.filter(u => !conn.isOwner(u))
  let promotedUser = []
  for (let user of users)
    if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => v.id == user) || {}).admin) {
      const res = await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
      promotedUser.concat(res)
      await delay(1 * 1000)
    }
  m.reply(`✅ *Usuario(s) promovido(s) a admin*\n\n${promotedUser.map(v => '▢ @' + v.split('@')[0]).join('\n')}`, null, { mentions: promotedUser })
}

handler.help = ['promote @user']
handler.tags = ['grupo']
handler.command = ['promote', 'promover', 'admin']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
