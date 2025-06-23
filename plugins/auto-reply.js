
const responses = [
  'Hola! ¿En qué puedo ayudarte? 😊',
  '¡Hola! Soy Roxy, tu asistente virtual 🤖',
  'Saludos! ¿Necesitas algo? ✨',
  'Hola! Estoy aquí para ayudarte 💫',
  '¡Qué tal! ¿En qué te puedo asistir? 🌟',
  'Hola! ¿Cómo puedo ayudarte hoy? 😄',
  '¡Hola! Roxy a tu servicio 🎈',
  'Saludos! ¿Qué necesitas? 🌸'
]

const keywords = [
  'hola', 'hello', 'hi', 'hey', 'buenos', 'buenas', 'saludos',
  'roxy', 'bot', 'ayuda', 'help', 'como estas', 'que tal'
]

let handler = m => m

handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
  // Solo en grupos
  if (!m.isGroup) return
  
  // Verificar si el sistema está habilitado globalmente
  if (!global.autoReply) return
  
  // Verificar si está habilitado en este chat
  let chat = global.db.data.chats[m.chat]
  if (!chat || !chat.autoReply) return
  
  // No responder a mensajes del bot
  if (m.fromMe) return
  
  // No responder si no hay texto
  if (!m.text) return
  
  // No responder a comandos
  if (m.text.startsWith(global.prefix)) return
  
  let text = m.text.toLowerCase()
  
  // Verificar si el bot fue mencionado o si contiene palabras clave
  let mentioned = m.mentionedJid.includes(conn.user.jid)
  let hasKeyword = keywords.some(keyword => text.includes(keyword))
  
  if (mentioned || hasKeyword) {
    // Probabilidad del 30% de responder para no ser muy spam
    if (Math.random() < 0.3) {
      let randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      // Pequeño delay para que parezca más natural
      setTimeout(() => {
        conn.reply(m.chat, randomResponse, m)
      }, 1000 + Math.random() * 2000) // Entre 1-3 segundos
    }
  }
}

export default handler
