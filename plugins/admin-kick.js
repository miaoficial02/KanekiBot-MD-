let handler = async (m, { conn, usedPrefix, command }) => {
	
  if (!m.mentionedJid[0] && !m.quoted) return m.reply(`✳️ Ingresa el tag de un usuario. Ejemplo :\n\n*${usedPrefix + command}* @tag`) 

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
  if (conn.user.jid.includes(user)) return m.reply(`✳️ No puedo hacer un auto kick`)

  await conn.groupParticipantsUpdate(m.chat, [user], 'remove')

  await conn.sendMessage(m.chat, {
    text: `✅ Usuario eliminado con éxito`,
    contextInfo: {
      externalAdReply: {
        title: 'KANEKIBOT-MD ⚙️',
        body: 'BOT OFICIAL • By BajoBots',
        thumbnailUrl: 'https://qu.ax/VGCPX.jpg', // 🔁 Cambia este link si deseas otra imagen
        sourceUrl: 'https://github.com/kleiner1-1', // Tu link o canal
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: false
      }
    }
  }, { quoted: m })
}

handler.help = ['kick @user']
handler.tags = ['group']
handler.command = ['kick', 'expulsar'] 
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
