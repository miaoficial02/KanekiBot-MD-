
let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!global.autoReply) {
    return m.reply('❌ *El sistema de respuesta automática está deshabilitado en la configuración global.*')
  }
  
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let isDisable = /false|disable|(turn)?off|0/i.test(command)
  
  if (isEnable) {
    global.db.data.chats[m.chat].autoReply = true
    m.reply('✅ *Respuesta automática ACTIVADA* para este grupo.\n\nAhora el bot responderá automáticamente a los mensajes cuando sea mencionado o cuando detecte ciertas palabras clave.')
  } else if (isDisable) {
    global.db.data.chats[m.chat].autoReply = false
    m.reply('❌ *Respuesta automática DESACTIVADA* para este grupo.\n\nEl bot ya no responderá automáticamente.')
  } else {
    let status = global.db.data.chats[m.chat].autoReply ? 'Activada' : 'Desactivada'
    m.reply(`🤖 *ESTADO DE RESPUESTA AUTOMÁTICA*

📊 *Estado actual:* ${status}
🏠 *Grupo:* ${await conn.getName(m.chat)}

*Comandos disponibles:*
• \`${usedPrefix}autoreply on\` - Activar
• \`${usedPrefix}autoreply off\` - Desactivar

*Nota:* Solo el creador puede usar este comando.`)
  }
}

handler.help = ['autoreply *on/off*']
handler.tags = ['owner']
handler.command = /^(autoreply|respuestauto)(on|off|enable|disable|1|0)?$/i
handler.rowner = true
handler.group = true

export default handler
let handler = async (m, { conn, args, usedPrefix, command }) => {
  
  let isEnable = /on|enable|activar|1/i.test(command)
  let isDisable = /off|disable|desactivar|0/i.test(command)
  
  if (isEnable) {
    global.db.data.chats[m.chat].autoReply = true
    m.reply('✅ *Respuesta automática ACTIVADA* para este grupo.\n\nAhora el bot responderá automáticamente cuando sea mencionado.')
  } else if (isDisable) {
    global.db.data.chats[m.chat].autoReply = false
    m.reply('❌ *Respuesta automática DESACTIVADA* para este grupo.')
  } else {
    let status = global.db.data.chats[m.chat].autoReply ? 'Activada' : 'Desactivada'
    m.reply(`🤖 *ESTADO DE RESPUESTA AUTOMÁTICA*

📊 *Estado actual:* ${status}
🏠 *Grupo:* ${await conn.getName(m.chat)}

*Comandos disponibles:*
• \`${usedPrefix}autoreply on\` - Activar
• \`${usedPrefix}autoreply off\` - Desactivar

*Nota:* Solo el creador puede usar este comando.`)
  }
}

handler.help = ['autoreply *on/off*']
handler.tags = ['owner']
handler.command = /^(autoreply|respuestauto)(on|off|enable|disable|activar|desactivar|1|0)?$/i
handler.rowner = true
handler.group = true

export default handler
