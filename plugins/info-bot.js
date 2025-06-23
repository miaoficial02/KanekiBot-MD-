
import { cpus as _cpus, totalmem, freemem, platform, arch } from 'os'
import { performance } from 'perf_hooks'

let handler = async (m, { conn, usedPrefix }) => {
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length
  let chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  let groupsIn = chats.filter(([id]) => id.endsWith('@g.us'))
  let used = process.memoryUsage()
  
  let info = `
╭─「 🤖 *INFO DEL BOT* 」
│
├ 🤖 *Nombre:* ${global.botname}
├ 👤 *Creador:* BajoBots  
├ 📝 *Versión:* ${global.vs}
├ 🌐 *Plataforma:* ${platform()}
├ 🏗️ *Arquitectura:* ${arch()}
├ ⏱️ *Tiempo Activo:* ${uptime}
├ 👥 *Usuarios Registrados:* ${totalreg}
├ 💬 *Chats Privados:* ${chats.length - groupsIn.length}
├ 👥 *Grupos:* ${groupsIn.length}
├ 💾 *Memoria Usada:* ${(used.rss / 1024 / 1024).toFixed(2)} MB
│
├ 🔗 *GitHub:* ${global.repobot}
├ 📢 *Canal:* ${global.channel}
├ 👥 *Grupo:* ${global.grupo}
│
╰─「 🌟 *𝐊𝐀𝐍𝐄𝐊𝐈 𝐁𝐎𝐓 - 𝐌𝐃* 」

> 🤍 𝐞𝐬𝐭𝐞 𝐛𝐨𝐭 𝐟𝐮𝐞 𝐝𝐞𝐬𝐚𝐫𝐫𝐨𝐥𝐥𝐚𝐝𝐨 𝐜𝐨𝐧 𝐚𝐦𝐨𝐫 𝐩𝐨𝐫 𝐛𝐚𝐣𝐨 𝐛𝐨𝐭𝐬
  `.trim()
  
  await conn.reply(m.chat, info, m)
}

handler.help = ['info', 'botinfo']
handler.tags = ['info']
handler.command = /^(info|botinfo|infobot)$/i

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
