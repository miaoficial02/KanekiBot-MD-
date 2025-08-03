const jugadores = []
const suplentes = []
const MAX_JUGADORES = 12
const MAX_SUPLENTES = 5

const reglas = `
🔥 *PARTIDA 12v12 FREE FIRE* 🔥
📍 *MAPA:* Abierto (Bermuda o Kalahari)
🕘 *Hora:* 8:00 PM
🎮 *Modo:* Personalizado
🛑 *Prohibido:* Lanzapapas, airdrops, emuladores
✅ *Permitido:* Todo lo demás
`

function obtenerLista() {
  let texto = "🎮 *Lista de Participantes (12v12)* 🎮\n\n"
  jugadores.forEach((nombre, i) => {
    texto += `${i + 1}. ${nombre}\n`
  })
  if (suplentes.length > 0) {
    texto += `\n⏳ *Suplentes:*\n`
    suplentes.forEach((nombre, i) => {
      texto += `${i + 1}. ${nombre}\n`
    })
  }
  texto += "\n📲 Usa *.anotarme* para entrar o *.reglas* para ver las reglas."
  return texto
}

const handler = async (m, { command, conn }) => {
  const nombre = await conn.getName(m.sender)

  switch (command) {
    case 'startff':
      m.reply(`${reglas}\n\n📲 Usa *.anotarme* para entrar o *.lista* para ver los jugadores.`)
      break

    case 'anotarme':
      if (jugadores.includes(nombre) || suplentes.includes(nombre)) {
        m.reply('⚠️ Ya estás anotado.')
      } else if (jugadores.length < MAX_JUGADORES) {
        jugadores.push(nombre)
        m.reply(`✅ ${nombre} anotado como jugador #${jugadores.length}.`)
      } else if (suplentes.length < MAX_SUPLENTES) {
        suplentes.push(nombre)
        m.reply(`🟡 ${nombre} anotado como *suplente* #${suplentes.length}.`)
      } else {
        m.reply('🚫 Lista llena. Ya no hay cupo.')
      }
      break

    case 'lista':
      m.reply(obtenerLista())
      break

    case 'reglas':
      m.reply(reglas)
      break

    case 'resetff':
      if (!global.owner.includes(m.sender)) return m.reply('❌ Solo el owner puede resetear la lista.')
      jugadores.length = 0
      suplentes.length = 0
      m.reply('✅ Lista de Free Fire reiniciada.')
      break

    default:
      m.reply('🤖 Comando no reconocido.')
  }
}

handler.command = ['12vs12']
handler.tags = ['freefire']
handler.help = ['12vs12', 'anotarme', 'lista', 'reglas', 'resetff']
handler.group = true

export default handler
