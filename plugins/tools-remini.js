import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, command }) => {
  conn.hdr = conn.hdr || {}
  if (m.sender in conn.hdr) throw '⚠️ Aún hay un proceso pendiente. Por favor, espera a que termine.'

  let q = m.quoted || m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  if (!mime) throw '📸 *Responde a una imagen con el comando para mejorarla*'
  if (!/image\/(jpe?g|png)/.test(mime)) throw `⚠️ *Formato no compatible:* ${mime}`

  conn.hdr[m.sender] = true
  await conn.sendMessage(m.chat, { react: { text: "🧠", key: m.key } })

  let img = await q.download?.()
  let error

  try {
    const imageUrl = await subirImagen(img)
    const api = `https://fastrestapis.fasturl.cloud/aiimage/upscale?imageUrl=${encodeURIComponent(imageUrl)}&resize=4`

    const res = await fetch(api)
    if (!res.ok) throw '❌ No se pudo procesar la imagen. Intenta con otra.'

    const buffer = await res.buffer()
    const type = res.headers.get('content-type') || 'image/jpeg'

    if (!type.startsWith('image/')) throw '❌ El archivo recibido no es una imagen.'

    await conn.sendMessage(m.chat, {
      image: buffer,
      mimetype: type,
      caption: `✅ *Imagen mejorada con KanekiBot-MD*\n\n🔎 Resolución aumentada 4x 📈`,
    }, { quoted: m })

  } catch (e) {
    error = true
    console.error(e)
    m.reply(typeof e === 'string' ? e : '❌ Error al procesar la imagen.')
  } finally {
    delete conn.hdr[m.sender]
  }
}

handler.help = ['hd', 'remini']
handler.tags = ['tools']
handler.command = /^(hd|remini)$/i

export default handler

async function subirImagen(buffer) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, 'image.jpg')

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form
  })

  const url = await res.text()
  if (!url.startsWith('https://')) throw '❌ Error al subir imagen a Catbox.'
  return url.trim()
}
