import moment from 'moment-timezone'

let handler = async (m, { conn, usedPrefix }) => {
  const taguser = '@' + m.sender.split('@')[0]
  const date = moment.tz('America/Bogota').format('DD/MM/YYYY')
  const time = moment.tz('America/Bogota').format('HH:mm:ss')

  let menuHeader = `
╭━〔 𓆩 👾 𝐊𝐀𝐍𝐄𝐊𝐈𝐁𝐎𝐓-𝐕𝟐 👾 𓆪 〕━╮
┃🌐 *Menú Free Fire | FF*
┃━━━━━━━━━━━━━━━━━━
┃📅 *Fecha:* ${date}
┃🕒 *Hora:* ${time}
┃👤 *Usuario:* ${taguser}
╰━━━━━━━━━━━━━━━━━━╯

🪓 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 𝐅𝐑𝐄𝐄 𝐅𝐈𝐑𝐄 🎮
`.trim()

  let commands = ''
  for (let plugin of Object.values(global.plugins)) {
    if (!plugin?.help || !plugin?.tags || !plugin.tags.includes('freefire')) continue
    for (let help of plugin.help) {
      commands += `┃🧩 ${usedPrefix}${help}\n`
    }
  }

  if (!commands) commands = '┃🚫 *No hay comandos registrados bajo la etiqueta "freefire".*'

  let menu = `${menuHeader}\n┏━━━━━━━━━━━━━━━━━━\n${commands}┗━━━━━━━━━━━━━━━━━━\n\n🎮 *Bot por @kleiner1-1*`

  await conn.sendMessage(m.chat, {
    video: { url: 'https://files.catbox.moe/mlp65k.mp4' },
    caption: menu.trim(),
    gifPlayback: true,
    contextInfo: {
      mentionedJid: [m.sender]
    }
  }, { quoted: m })
}

handler.help = ['ffmenu']
handler.tags = ['freefire']
handler.command = ['ffmenu']

export default handler
