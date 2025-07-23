import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn }) => {
  conn.hdr = conn.hdr || {}
  if (m.sender in conn.hdr) throw '⚠️ Aún hay un proceso pendiente. Por favor, espera.'

  let q = m.quoted || m
  let mime = (q.msg || q).mimetype || ''
  if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
    throw '📸 *Responde a una imagen JPG o PNG con el comando para mejorarla*'
  }

  conn.hdr[m.sender] = true
  await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } })

  let img = await q.download?.()
  let error

  try {
    const form = new FormData()
    form.append('image_file', img, 'image.jpg')

    // Nueva API sin necesidad de URL externa
    const res = await fetch('https://api.itsrose.life/image/upscale?resize=4&apikey=itsrose', {
      method: 'POST',
      body: form
    })

    if (!res.ok) throw '❌ La API no pudo procesar la imagen.'

    const buffer = await res.buffer()
    const type = res.headers.get('content-type') || 'image/jpeg'

    if (!type.startsWith('image/')) throw '❌ No se recibió una imagen válida.'

    await conn.sendMessage(m.chat, {
      image: buffer,
      mimetype: type,
      caption: `✅ *Imagen mejorada 4x con KanekiBot-MD*\n🌟 Calidad mejorada automáticamente.`,
    }, { quoted: m })

  } catch (e) {
    error = true
    console.error(e)
    m.reply(typeof e === 'string' ? e : '❌ No se pudo procesar la imagen.')
  } finally {
    delete conn.hdr[m.sender]
  }
}

handler.help = ['hd', 'remini']
handler.tags = ['tools']
handler.command = /^(hd|remini)$/i

export default handler
