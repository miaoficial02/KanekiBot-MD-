
let handler = async (m, { conn, text, usedPrefix, command }) => {
  let cara = Math.floor(Math.random() * 6) + 1
  let dados = {
    1: '⚀',
    2: '⚁', 
    3: '⚂',
    4: '⚃',
    5: '⚄',
    6: '⚅'
  }

  await conn.reply(m.chat, `
🎲 *Dado lanzado por ${m.pushName}*

${dados[cara]}

*Resultado:* ${cara}
  `.trim(), m)
}

handler.help = ['dado']
handler.tags = ['fun']
handler.command = /^(dado|dice)$/i

export default handler
