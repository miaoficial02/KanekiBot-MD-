import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (!mime) {
    return conn.reply(m.chat, `📌 *Por favor, responde a una imagen o video para subir a qu.ax.*`, m)
  }

  const rwait = '🔄'
  const done = '✅'
  const error = '❌'
  const dev = 'KanekiBot-MD'
  const fkontak = null // Puedes personalizar este contacto si usas uno falso

  await m.react(rwait)

  try {
    const media = await q.download()
    const url = await uploadToQuax(media)

    const txt = `
┏━━⬣「 *ENLACE QU.AX* 」⬣
┃ 🔗 *Enlace:* ${url}
┃ 📦 *Tamaño:* ${formatBytes(media.length)}
┃ ⏳ *Expira:* Desconocido
┗━━⬣ *${dev}*
    `.trim()

    await conn.sendFile(m.chat, media, 'upload.jpg', txt, m, fkontak)
    await m.react(done)

  } catch (e) {
    console.error(e)
    await m.react(error)
    return conn.reply(m.chat, '❌ *Error al subir el archivo a qu.ax.*', m)
  }
}

handler.help = ['tourl']
handler.tags = ['tools']
handler.command = ['tourl', 'upload']
handler.register = false

export default handler

async function uploadToQuax(buffer) {
  const form = new FormData()
  form.append('file', buffer, 'kaneki_upload.jpg') // o .mp4 si es video

  const res = await fetch('https://qu.ax/upload', {
    method: 'POST',
    body: form
  })

  const json = await res.json()
  if (!json.url) throw '❌ Error al subir a qu.ax.'

  return json.url
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}
