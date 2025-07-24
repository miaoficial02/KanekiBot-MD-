const inscritos = {}

let handler = async (m, { conn, command }) => {
  const chatId = m.chat

  // Inicializar lista si no existe
  if (!inscritos[chatId]) inscritos[chatId] = []

  const jugadores = inscritos[chatId]
  const yaInscrito = jugadores.includes(m.sender)

  if (yaInscrito) {
    return m.reply('⚠️ Ya estás registrado en esta sala 4vs4.')
  }

  if (jugadores.length >= 8) {
    return m.reply('❌ La sala ya tiene 8 jugadores inscritos.')
  }

  jugadores.push(m.sender)

  // Construir lista visual
  let lista = jugadores.map((jid, i) => {
    let tag = '@' + jid.split('@')[0]
    return `👤 *Jugador ${i + 1}:* ${tag}`
  }).join('\n')

  let total = jugadores.length
  let faltan = 8 - total

  let texto = `
🎮 *PARTIDA 4 VS 4 - FREE FIRE* 🔥

📋 *Jugadores inscritos:* ${total}/8
${lista}

📝 *¿Quieres unirte?*
Solo escribe *4vs4* y te añadimos.

${faltan > 0 ? `⏳ *Faltan ${faltan} jugadores.*` : `✅ *Equipos listos, dividiendo...*`}

${faltan === 0 ? equipos(jugadores) : ''}
`.trim()

  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: jugadores
  }, { quoted: m })

  // Limpiar lista cuando ya están los 8
  if (jugadores.length === 8) {
    delete inscritos[chatId]
  }
}

handler.help = ['4vs4']
handler.tags = ['freefire']
handler.command = /^4vs4$/i

export default handler

function equipos(lista) {
  let A = lista.slice(0, 4).map(j => '@' + j.split('@')[0]).join('\n')
  let B = lista.slice(4).map(j => '@' + j.split('@')[0]).join('\n')
  return `
╭───〔 🅴🆀🆄🅸🅿🅾 🅰 〕
${A}
╰───────────────╯

╭───〔 🅴🆀🆄🅸🅿🅾 🅱 〕
${B}
╰───────────────╯
`.trim()
                 }
      
