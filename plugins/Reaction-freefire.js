export async function handler(reaction, { conn }) {
  const data = conn.torneos?.[reaction.key?.id]
  if (!data) return

  const user = reaction.sender
  const emoji = reaction.text
  const username = `@${user.split('@')[0]}`

  // Elimina duplicados
  data.titulares = data.titulares.filter(u => u !== user)
  data.suplentes = data.suplentes.filter(u => u !== user)

  if (emoji === '👍') {
    if (data.titulares.length < 4) {
      data.titulares.push(user)
    }
  } else if (emoji === '❤️') {
    if (data.suplentes.length < 2) {
      data.suplentes.push(user)
    }
  }

  const titulares = [
    data.titulares[0] ? `👑 @${data.titulares[0].split('@')[0]}` : '👑 —',
    data.titulares[1] ? `🥷 @${data.titulares[1].split('@')[0]}` : '🥷 —',
    data.titulares[2] ? `🥷 @${data.titulares[2].split('@')[0]}` : '🥷 —',
    data.titulares[3] ? `🥷 @${data.titulares[3].split('@')[0]}` : '🥷 —'
  ].join('\n')

  const suplentes = [
    data.suplentes[0] ? `🔁 @${data.suplentes[0].split('@')[0]}` : '🔁 —',
    data.suplentes[1] ? `🔁 @${data.suplentes[1].split('@')[0]}` : '🔁 —'
  ].join('\n')

  const nuevoTexto = `
🧨 *TORNEO 4 VS 4* ⚔️
──────────────────────────

🕓 *HORARIOS DISPONIBLES*
🇲🇽 México: --
🇨🇴 Colombia: --

🎮 *MODALIDAD:* Clásico / PvP

🎯 *JUGADORES TITULARES*
${titulares}

💤 *SUPLENTES*
${suplentes}

──────────────────────────
📝 Reacciona con 👍 para jugar
📝 Reacciona con ❤️ para ser suplente
`.trim()

  await conn.sendMessage(data.chat, {
    text: nuevoTexto,
    mentions: [...data.titulares, ...data.suplentes]
  }, { quoted: data.msg })
                         }
