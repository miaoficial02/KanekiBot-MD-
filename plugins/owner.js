let handler = async (m, { args, usedPrefix, command }) => {
  const name = args.join(" ")
  if (!name) return m.reply(`✨ *Usa el comando así:*\n\n${usedPrefix + command} MiSubBot`)

  if (name.length > 25) return m.reply("⚠️ *El nombre es muy largo.* Usa menos de 25 caracteres.")

  global.db.data.settings = global.db.data.settings || {}
  global.db.data.settings[m.sender] = global.db.data.settings[m.sender] || {}
  global.db.data.settings[m.sender].menuBotName = name // SOLO para ese subbot

  m.reply(`✅ *Nombre del menú de tu subbot cambiado a:* *${name}*`)
}

handler.help = ['setname <nombre>']
handler.tags = ['']
handler.command = /^setname$/i
handler.register = true

export default handler
