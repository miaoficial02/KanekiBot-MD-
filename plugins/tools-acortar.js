
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🔗 *Uso:* ${usedPrefix + command} <url>\n\n📌 *Ejemplo:* ${usedPrefix + command} https://www.google.com`
  
  if (!/^https?:\/\//.test(text)) throw '❌ La URL debe comenzar con http:// o https://'
  
  try {
    let res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`)
    let short = await res.text()
    
    if (short === 'Error') throw 'Error al acortar la URL'
    
    let result = `
🔗 *URL Acortada*

📎 *URL Original:*
${text}

✂️ *URL Acortada:*
${short}

👤 *Solicitado por:* ${m.pushName}
    `.trim()
    
    await conn.reply(m.chat, result, m)
  } catch (e) {
    throw '❌ Error al acortar la URL'
  }
}

handler.help = ['acortar <url>']
handler.tags = ['tools']
handler.command = /^(acortar|short|shorturl)$/i

export default handler
