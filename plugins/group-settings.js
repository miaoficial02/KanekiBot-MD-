
let handler = async (m, { conn, args, usedPrefix, command }) => {
  let isClose = {
    'open': 'not_announcement',
    'buka': 'not_announcement',
    'on': 'not_announcement',
    '1': 'not_announcement',
    'close': 'announcement',
    'tutup': 'announcement',
    'off': 'announcement',
    '0': 'announcement',
  }[(args[0] || '')]
  
  if (isClose === undefined) {
    let sections = [
      {
        title: "⚙️ CONFIGURACIÓN DEL GRUPO",
        rows: [
          { title: "🔓 Abrir Grupo", description: "Permite que todos puedan enviar mensajes", rowId: `${usedPrefix + command} open` },
          { title: "🔒 Cerrar Grupo", description: "Solo admins pueden enviar mensajes", rowId: `${usedPrefix + command} close` },
        ]
      },
      {
        title: "🎉 SISTEMA DE BIENVENIDA",
        rows: [
          { title: "✅ Activar Bienvenida", description: "Activa mensajes de bienvenida", rowId: `${usedPrefix}welcome on` },
          { title: "❌ Desactivar Bienvenida", description: "Desactiva mensajes de bienvenida", rowId: `${usedPrefix}welcome off` },
        ]
      },
      {
        title: "🤖 RESPUESTA AUTOMÁTICA (Solo Owner)",
        rows: [
          { title: "✅ Activar AutoReply", description: "El bot responderá automáticamente", rowId: `${usedPrefix}autoreply on` },
          { title: "❌ Desactivar AutoReply", description: "Desactiva respuestas automáticas", rowId: `${usedPrefix}autoreply off` },
        ]
      }
    ]
    
    let listMessage = {
      text: '⚙️ *CONFIGURACIÓN DEL GRUPO*\n\nSelecciona una opción:',
      footer: global.wm,
      title: null,
      buttonText: "⚙️ OPCIONES",
      sections
    }
    
    return conn.sendMessage(m.chat, listMessage, { quoted: m })
  }
  
  await conn.groupSettingUpdate(m.chat, isClose)
}

handler.help = ['group *open/close*']
handler.tags = ['grupo']
handler.command = /^(group|grupo)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler
