import yts from 'yt-search'
import axios from 'axios'

const handler = async (m, { conn, args, command }) => {
  const text = args.join(' ').trim()
  if (!text) {
    return await conn.sendMessage(m.chat, {
      text: `┏━━━꒷꒦『 *🎧 DESCARGA MP3* 』꒷꒦━━━┓
┃ 📝 *Ejemplo:* .${command} mon amour
┗━━━━━━━━━━━━━━━━━┛`,
    }, { quoted: m })
  }

  await conn.sendMessage(m.chat, { text: '🎶 *Buscando tu canción...*' }, { quoted: m })

  try {
    const search = await yts(text)
    const video = search.videos[0]

    if (!video) {
      return conn.sendMessage(m.chat, { text: '❌ No se encontró ninguna canción con ese nombre.' }, { quoted: m })
    }

    if (video.seconds > 600) {
      return conn.sendMessage(m.chat, {
        text: `⚠️ La duración es muy larga.
🎵 *Título:* ${video.title}
⏱️ *Duración:* ${video.timestamp}
❗ Máximo permitido: 10 minutos.`,
      }, { quoted: m })
    }

    const api = await axios.get(`https://apis-keith.vercel.app/download/dlmp3?url=${video.url}`)
    const res = api.data

    if (!res.status || !res.result?.downloadUrl) {
      return conn.sendMessage(m.chat, { text: '⚠️ No se pudo obtener el audio. Intenta nuevamente más tarde.' }, { quoted: m })
    }

    const caption = `
┏━━━꒷꒦『 *📥 MP3 DESCARGADO* 』꒷꒦━━━┓
┃ 🎵 *Título:* ${res.result.title}
┃ ⏱️ *Duración:* ${video.timestamp}
┃ 📎 *Tamaño:* ${res.result.size}
┃ 🌐 *Link:* ${video.url}
┗━━━━━━━━━━━━━━━━━┛`

    await conn.sendMessage(m.chat, {
      audio: { url: res.result.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${res.result.title}.mp3`,
      caption
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    conn.sendMessage(m.chat, { text: '❌ *Error inesperado.* Intenta más tarde o usa otro comando.' }, { quoted: m })
  }
}

handler.command = [ 'cancion']
export default handler
