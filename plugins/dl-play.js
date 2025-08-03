// 🌿 Plugin: Play Audio por texto (YouTube).
// 🌿 Función: Descarga y reproduce música.
// 🌱 Autores: Izumi.xyz. BajoBots 
// ⚠️ No eliminar ni modificar créditos, respeta al creador del código.
import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, text, args }) => {
  if (!text) {
    return m.reply("🍃 Ingresa el texto de lo que quieres buscar")
  }

  let ytres = await search(args.join(" "))
  if (!ytres.length) {
    return m.reply("🍃 No se encontraron resultados para tu búsqueda.")
  }

  let izumi = ytres[0]
  let txt = `🎬 *Título*: ${izumi.title}
⏱️ *Duración*: ${izumi.timestamp}
📅 *Publicado*: ${izumi.ago}
📺 *Canal*: ${izumi.author.name || 'Desconocido'}
🔗 *Url*: ${izumi.url}`
  await conn.sendFile(m.chat, izumi.image, 'thumbnail.jpg', txt, m)

  try {
    const apiUrl = `https://orbit-oficial.vercel.app/api/download/YTMP3?key=OrbitPlus&url=${encodeURIComponent(izumi.url)}`
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (data.status !== true || !data.download) {
      throw new Error('Fallo al obtener el audio. JSON inesperado')
    }

    const { title, download } = data

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: download },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      },
      { quoted: m }
    )
  } catch (error) {
    console.error(error)
    m.reply(`❌ Lo siento, no pude descargar el audio.\n${error.message}`)
  }
}

handler.command = /^(play)$/i
export default handler

async function search(query, options = {}) {
  let result = await yts.search({ query, hl: "es", gl: "ES", ...options })
  return result.videos || []
}
