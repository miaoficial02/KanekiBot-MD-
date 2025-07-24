let handler = async (m, { conn }) => {
  if (!m.isGroup) return m.reply('❗ *Este comando solo se puede usar en grupos.*')

  const texto = `
🧨 *TORNEO 4 VS 4* ⚔️
──────────────────────────

🕓 *HORARIOS DISPONIBLES*
🇲🇽 México: --
🇨🇴 Colombia: --

🎮 *MODALIDAD:* Clásico / PvP

🎯 *JUGADORES TITULARES*
👑 —
🥷 —
🥷 —
🥷 —

💤 *SUPLENTES*
🔁 —
🔁 —

──────────────────────────
📝 Reacciona con 👍 para jugar
📝 Reacciona con ❤️ para ser suplente
`.trim()

  const msg = await conn.sendMessage(m.chat, { text: texto }, { quoted: m })

  // Agrega reacciones visibles
  await conn.sendMessage(m.chat, { react: { text: '👍', key: msg.key } })
  await conn.sendMessage(m.chat, { react: { text: '❤️', key: msg.key } })

  // Guardamos los datos
  conn.torneos = conn.torneos || {}
  conn.torneos[msg.key.id] = {
    titulares: [],
    suplentes: [],
    msg,
    chat: m.chat
  }
}

handler.command = /^4vs4$/i
handler.group = true
handler.tags = ['freefire']
handler.help = ['4vs4']

export default handler
