let handler = async (m, { conn, text }) => {
  if (!text) throw '❌ *Texto requerido*'

  let chats = Object.keys(conn.chats).filter(jid => !jid.endsWith('@g.us') && !jid.includes('@broadcast'))

  conn.reply(m.chat, `📢 *Iniciando difusión...*\n\n▢ Enviando a: ${chats.length} chats privados\n▢ Tiempo estimado: ${chats.length * 1}s`, m)

  let sent = 0
  let failed = 0

  for (let id of chats) {
    try {
      await conn.sendMessage(id, { 
        text: `📢 *MENSAJE DEL CREADOR*\n\n${text}\n\n> ${global.wm}` 
      })
      sent++
    } catch {
      failed++
    }
  }

  m.reply(`✅ *Difusión completada*\n\n▢ Enviados: ${sent}\n▢ Fallidos: ${failed}\n▢ Total: ${chats.length}`)
}

handler.help = ['bcchats <text>']
handler.tags = ['owner']
handler.command = ['bcchats']
handler.owner = true

export default handler