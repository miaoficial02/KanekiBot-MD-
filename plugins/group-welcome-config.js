
let handler = async (m, { conn, args, usedPrefix, command }) => {
  let chat = global.db.data.chats[m.chat]
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  
  if (args[0] === 'on' || args[0] === 'enable' || args[0] === '1') {
    chat.welcome = true
    m.reply('✅ *Bienvenida activada* 🎉\n\nAhora se enviará un mensaje cuando alguien entre o salga del grupo.')
  } else if (args[0] === 'off' || args[0] === 'disable' || args[0] === '0') {
    chat.welcome = false
    m.reply('❌ *Bienvenida desactivada* 🚫\n\nYa no se enviarán mensajes de bienvenida.')
  } else {
    let sections = [
      {
        title: "🎉 CONFIGURACIÓN DE BIENVENIDA",
        rows: [
          { title: "✅ Activar", description: "Activa mensajes de bienvenida y despedida", rowId: `${usedPrefix}welcome on` },
          { title: "❌ Desactivar", description: "Desactiva mensajes de bienvenida y despedida", rowId: `${usedPrefix}welcome off` },
        ]
      }
    ]
    
    let listMessage = {
      text: `🎉 *SISTEMA DE BIENVENIDA*\n\nEstado actual: ${chat.welcome ? '✅ Activado' : '❌ Desactivado'}\n\n┌─⊷ *INFORMACIÓN*\n▢ Bienvenida: ${chat.welcome ? 'Activa' : 'Inactiva'}\n▢ Grupo: ${await conn.getName(m.chat)}\n└─⊷\n\nSelecciona una opción:`,
      footer: global.wm,
      title: null,
      buttonText: "⚙️ CONFIGURAR",
      sections
    }
    
    return conn.sendMessage(m.chat, listMessage, { quoted: m })
  }
}

handler.help = ['welcome']
handler.tags = ['grupo']
handler.command = ['welcome', 'bienvenida']
handler.group = true
handler.admin = true

export default handler
