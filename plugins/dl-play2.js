import fetch from "node-fetch"
import yts from "yt-search"
import axios from "axios"

const ytDownloader = {
  get: async (url, format) => {
    const res = await axios.get(`https://p.oceansaver.in/ajax/download.php`, {
      params: {
        url,
        format,
        api: 'dfcb6d76f2f6a9894gjkege8a4ab232222'
      },
      headers: {
        'User-Agent': 'KanekiBot-MD'
      }
    })

    const { success, id, title, info } = res.data
    if (!success) throw new Error("❌ No se pudo obtener el audio.")

    const downloadUrl = await ytDownloader.waitFor(id)
    return { title, thumb: info.image, downloadUrl }
  },

  waitFor: async (id) => {
    const url = `https://p.oceansaver.in/ajax/progress.php?id=${id}`
    for (;;) {
      const res = await axios.get(url)
      if (res.data?.success && res.data.progress === 1000) return res.data.download_url
      await new Promise(res => setTimeout(res, 3000))
    }
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`╭─「 *KanekiBot-MD* ⚙️ 」─⬣
│ 🧠 *Uso:* ${usedPrefix + command} <nombre o link>
╰────────────────────⬣`)
  }

  await m.react("🎧")

  try {
    const search = await yts(text)
    if (!search.all.length) return m.reply("❌ No encontré nada con ese nombre.")

    const video = search.videos[0]
    const { title, url, thumbnail, timestamp, views, ago, author } = video
    const viewStr = Number(views).toLocaleString()

    const caption = `
╭─❍「 *KanekiBot-MD Music* 」❍
│ 🎧 *Título:* ${title}
│ 🕐 *Duración:* ${timestamp}
│ 📺 *Canal:* ${author.name}
│ 👁️ *Vistas:* ${viewStr}
│ 📆 *Publicado:* ${ago}
│ 🔗 *Enlace:* ${url}
╰────────────⬣`

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption
    }, { quoted: m })

    // Descargar y enviar audio
    const audioData = await ytDownloader.get(url, 'mp3')

    await conn.sendMessage(m.chat, {
      audio: { url: audioData.downloadUrl },
      mimetype: 'audio/mp4', // clave para reproducible
      ptt: false
    }, { quoted: m })

    await m.react("✅")

  } catch (e) {
    console.error(e)
    m.reply(`❌ Error al procesar tu solicitud.\n\n${e.message}`)
    await m.react("❌")
  }
}

handler.help = ['play']
handler.tags = ['descargas']
handler.command = /^play$/i
handler.register = true

export default handler
    
