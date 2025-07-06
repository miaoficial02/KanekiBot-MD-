//By Bajo Bots

import yts from 'yt-search'

let handler = async (m, { conn, text }) => {
  if (!text) throw `🚫 𝙄𝙣𝙜𝙧𝙚𝙨𝙖 𝙚𝙡 𝙣𝙤𝙢𝙗𝙧𝙚 𝙙𝙚 𝙪𝙣 𝙫𝙞𝙙𝙚𝙤 𝙙𝙚 𝙔𝙤𝙪𝙏𝙪𝙗𝙚.\n\n📌 *Ejemplo:* .ytsearch Bizarrap Shakira`

  let results = await yts(text)
  let videos = results.videos

  let info = videos.map(v => `
┏━━━━━━━━━━━━━━━━━━━⬣
┃✨ *${v.title}*
┣━━━━━━━━━━━━━━━━━━━✦
┃⏳ *Duración:* ${v.timestamp}
┃📅 *Subido:* ${v.ago}
┃👀 *Vistas:* ${v.views.toLocaleString()}
┃🔗 *Enlace:* ${v.url}
┗━━━━━━━━━━━━━━━━━━━⬣
`).join('\n')

  let message = `┏━━━━━━━━━━━━━━⬣\n┃🎬 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - 𝐁𝐔𝐒𝐐𝐔𝐄𝐃𝐀\n┗━━━━━━━━━━━━━━⬣\n\n${info}`

  conn.sendFile(m.chat, videos[0].image, 'yts.jpeg', message, m)
}

handler.help = ['ytsearch'] 
handler.tags = ['download']
handler.command = ['ytsearch', 'yts'] 

export default handler
