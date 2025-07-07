import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`╭─「 *KanekiBot-MD* ⚙️ 」─⬣
│ ✨ *Uso:* ${usedPrefix + command} <link de TikTok>
╰────────────────────⬣`)
  }

  await m.react('🎶')

  try {
    const res = await fetch(`https://api.tiklydown.me/api/download?url=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.status || !json.data?.music) {
      throw new Error('No se pudo obtener el audio del video.')
    }

    const {
      title,
      music,
      thumbnail,
      author_name,
      region,
      duration
    } = json.data

    const caption = `
╭─❍「 *KanekiBot-MD – TikTok Audio* 」❍
│ 🎧 *Audio de:* ${author_name}
│ 🕒 *Duración:* ${duration}s
│ 🌍 *Región:* ${region}
│ 📌 *Título:* ${title}
│ 🔗 *Fuente:* ${text}
╰────────────⬣`

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      audio: { url: music },
      mimetype: 'audio/mp4',
      ptt: false
    }, { quoted: m })

    await m.react("✅")

  } catch (e) {
    console.error(e)
    await m.react("❌")
    return m.reply(`❌ *Ocurrió un error al descargar el audio de TikTok.*`)
  }
}

handler.help = ['tiktokmp3']
handler.tags = ['download']
handler.command = /^tiktokmp3$/i
handler.register = false

export default handler
      
