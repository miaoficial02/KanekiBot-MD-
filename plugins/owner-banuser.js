
let handler = async (m, { conn, text, usedPrefix, command }) => {
  let who
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
  else who = m.chat
  if (!who) throw `❌ *Etiqueta o responde a un usuario*\n\n*Ejemplo:* ${usedPrefix + command} @usuario`
  
  let users = global.db.data.users
  users[who].banned = true
  
  conn.reply(m.chat, `✅ *Usuario baneado exitosamente*\n\n▢ Usuario: @${who.split`@`[0]}\n▢ Baneado por: @${m.sender.split`@`[0]}\n▢ Fecha: ${new Date().toLocaleDateString()}\n\n*El usuario ya no podrá usar el bot*`, m, { mentions: [who, m.sender] })
}

handler.help = ['ban @user']
handler.tags = ['owner']
handler.command = ['ban', 'banuser']
handler.owner = true

export default handler
