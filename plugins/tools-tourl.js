import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (!mime) {
    return conn.reply(m.chat, `📌 *Responde a una imagen o video para subirlo a Catbox.*`, m)
  }

  const rwait = '🔄'
  const done = '✅'
  const error = '❌'
  const dev = 'KanekiBot-MD'
  const fkontak = null

  await m.react(rwait)

  try {
    const media = await q.download()
    const url = await uploadToCatbox(media)

    const txt = `
┏━━⬣「 *ENLACE CATBOX* 」⬣
┃ 🔗 *Enlace:* ${url}
┃ 📦 *Tamaño:* ${formatBytes(media.length)}
┃ 🚫 *Expira:* Nunca (almacenamiento permanente)
┗━━⬣ *${dev}*
    `.trim()

    await conn.sendFile(m.chat, media, 'upload.jpg', txt, m, fkontak)
    await m.react(done)

  } catch (e) {
    console.error(e)
    await m.react(error)
    return conn.reply(m.chat, '❌ *Error al subir el archivo a Catbox.*', m)
  }
}

handler.help = ['tourl']
handler.tags = ['tools']
handler.command = ['tourl', 'upload']
handler.register = false

export default handler

async function uploadToCatbox(buffer) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, 'kaneki_upload.jpg')

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form
  })

  const text = await res.text()
  if (!text.startsWith('https://')) throw '❌ Error al subir a Catbox.'

  return text.trim()
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}
