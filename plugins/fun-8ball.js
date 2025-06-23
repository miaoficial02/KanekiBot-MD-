
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🎱 *Uso:* ${usedPrefix + command} <pregunta>\n\n📌 *Ejemplo:* ${usedPrefix + command} ¿Tendré suerte hoy?`
  
  let responses = [
    '✅ Sí, definitivamente',
    '✅ Sin duda alguna',
    '✅ Puedes contar con ello',
    '✅ Muy probable',
    '✅ Las señales apuntan a que sí',
    '🤔 Pregunta de nuevo más tarde',
    '🤔 Mejor no decirte ahora',
    '🤔 No puedo predecirlo ahora',
    '🤔 Concéntrate y pregunta de nuevo',
    '❌ No cuentes con ello',
    '❌ Mi respuesta es no',
    '❌ Mis fuentes dicen que no',
    '❌ Las perspectivas no son buenas',
    '❌ Muy dudoso'
  ]
  
  let response = responses[Math.floor(Math.random() * responses.length)]
  
  await conn.reply(m.chat, `
🎱 *Bola 8 Mágica*

❓ *Pregunta:* ${text}

🔮 *Respuesta:* ${response}

👤 *Consultado por:* ${m.pushName}
  `.trim(), m)
}

handler.help = ['8ball <pregunta>']
handler.tags = ['fun']
handler.command = /^(8ball|bola8|magic8)$/i

export default handler
