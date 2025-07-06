import fetch from "node-fetch"
import yts from "yt-search"
import axios from "axios"

const AUDIO_FORMATS = ["mp3", "m4a", "webm", "aac", "flac", "opus", "ogg", "wav"]
const VIDEO_FORMATS = ["360", "480", "720", "1080", "1440", "4k"]

const ytDownloader = {
  get: async (url, format) => {
    if (!AUDIO_FORMATS.includes(format) && !VIDEO_FORMATS.includes(format)) {
      throw new Error("❗ Formato inválido, por favor intenta con otro.")
    }

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
    if (!success) throw new Error("❌ No se pudo obtener la descarga.")

    const downloadUrl = await ytDownloader.waitFor(id)
    return { downloadUrl, title, thumb: info.image }
  },

  waitFor: async (id) => {
    const endpoint = `https://p.oceansaver.in/ajax/progress.php?id=${id}`
    for (;;) {
      const { data } = await axios.get(endpoint)
      if (data.success && data.progress === 1000) return data.download_url
      await new Promise(res => setTimeout(res, 3000))
    }
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`╭─「 *KanekiBot-MD* ⚙️ 」─⬣
│ ✨ Usa:  ${usedPrefix + command} <nombre o link>
╰────────────────────⬣`)
  }

  await m.react("🔎")

  const search = await yts(text)
  if (!search.all.length) return m.reply("❌ No se encontró ningún resultado.")

  const video = search.videos[0]
  const { title, url, thumbnail, timestamp, views, ago, author } = video
  const viewStr = Number(views).toLocaleString()

  const caption = `
┌───「 *KANEKI-BOT DOWNLOADER* 」───
│ 🎧 *Título:* ${title}
│ 🕒 *Duración:* ${timestamp}
│ 📅 *Publicado:* ${ago}
│ 👤 *Canal:* ${author?.name || "Desconocido"}
│ 👁️ *Vistas:* ${viewStr}
│ 🔗 *Enlace:* ${url}
└───────────────────────────`.trim()

  await conn.sendMessage(m.chat, {
    image: { url: thumbnail },
    caption,
  }, { quoted: m })

  try {
    if (["play", "yta", "ytmp3"].includes(command)) {
      await m.react("🎵")
      const audio = await ytDownloader.get(url, "mp3")
      return await conn.sendMessage(m.chat, {
        document: { url: audio.downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${audio.title}.mp3`
      }, { quoted: m })
    }

    if (["play2", "ytv", "ytmp4"].includes(command)) {
      await m.react("🎥")
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ]

      for (let api of sources) {
        try {
          const res = await fetch(api)
          const json = await res.json()
          const link = json?.result?.download?.url || json?.data?.dl || json?.downloads?.url

          if (link) {
            return await conn.sendMessage(m.chat, {
              video: { url: link },
              mimetype: 'video/mp4',
              caption: `🎬 Aquí tienes tu video\n📡 *Fuente:* ${api.split("/")[2]}`
            }, { quoted: m })
          }
        } catch (err) {
          console.error("❗ Fallo en una fuente:", err.message)
        }
      }

      return m.reply("❌ No se pudo obtener el video desde ninguna fuente.")
    }

  } catch (e) {
    console.error("❗ Error:", e)
    m.reply("💥 Ocurrió un error al procesar tu solicitud.")
  }
}

handler.help = ['play', 'play2', 'yta', 'ytmp3', 'ytv', 'ytmp4']
handler.tags = ['descargas']
handler.command = /^play2?$|^yt(a|mp3|v|mp4)$/i
handler.register = true

export default handler
        
