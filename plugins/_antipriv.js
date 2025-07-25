let handler = async (m, { conn, args, command }) => {
  const isOwner = global.owner.some(([v]) => v === m.sender)

  // --- Modo detección privada ---
  if (!m.isGroup && !isOwner && m.from !== undefined) {
    global.opts = global.opts || {}
    if (global.opts.antiprivado) {
      const texto = `
╭━〔 *🚫 ACCESO DENEGADO* 〕━⬣
┃
┃ ✦ Hola, *${conn.getName(m.sender)}* 👋🏻
┃
┃ ❌ Los comandos por privado están
┃     *desactivados actualmente.*
┃
┃ 🛡️ Por seguridad, el bot no responde
┃     mensajes fuera de los grupos.
┃
┃ ✅ Usa el bot en un grupo o espera
┃     ser autorizado por el Owner.
┃
╰━〔 *KanekiBot - Protección Activa* 〕━⬣
`.trim()

      await m.reply(texto)
      await new Promise(r => setTimeout(r, 1200))
      await conn.updateBlockStatus(m.sender, 'block')
    }
    return
  }

  // --- Modo comando para Owner ---
  if (!m.isGroup && isOwner && /^antiprv|antiprivado$/i.test(command)) {
    const option = args[0]?.toLowerCase()
    if (!['on', 'off'].includes(option)) {
      return m.reply(`⚙️ *Uso correcto:*\n\n.antiprv on  → Activar\n.antiprv off → Desactivar`)
    }

    global.opts = global.opts || {}
    global.opts.antiprivado = option === 'on'

    return m.reply(`✅ *AntiPrivado ${option === 'on' ? 'activado' : 'desactivado'} correctamente.*`)
  }
}

handler.command = /^antiprv|antiprivado$/i
handler.private = true
handler.all = true
handler.tags = ['owner']
handler.help = ['antiprv on/off']
handler.rowner = true

export default handler
