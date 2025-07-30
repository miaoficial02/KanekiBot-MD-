let handler = async (m, { args, usedPrefix, command }) => {
  const name = args.join(" ")
  if (!name) return m.reply(`✨ *Usa el comando así:*\n\n${usedPrefix + command} MiBotPersonal`)

  if (name.length > 25) return m.reply("⚠️ *El nombre es muy largo.* Usa menos de 25 caracteres.")

  global.db.data.settings = global.db.data.settings || {}
  global.db.data.settings[m.sender] = global.db.data.settings[m.sender] || {}
  global.db.data.settings[m.sender].menuBotName = name

  m.reply(`✅ *Nombre del menú actualizado a:* *${name}*\n\n📌 Usa *.menu* para ver el cambio.`)
}
 
handler.help = ['setname <nombre>']
handler.tags = ['']
handler.command = /^setname$/i
handler.register = false

export default handler
