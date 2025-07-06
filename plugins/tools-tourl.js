import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (!mime) {
    return conn.reply(m.chat, `📌 *Responde a una imagen o video para subir a qu.ax*`, m)
  }

  const rwait = '🔄'
  const done = '✅'
  const error = '❌'
  const dev = 'KanekiBot-MD'
  const fkontak = null // puedes personalizar con contacto falso

  await m.react(rwait)

  try {
    const media = await q.download()
    const ext = mime.split('/')[1].split(';')[0]
    const filename = `kaneki_upload.${ext}`
    const url = await uploadToQuax(media, filename)

    const txt = `
┏━━⬣「 *E N L A C E - Q U . A X* 」⬣
┃ 🔗 *Link:* ${url}
┃ 📦 *Tamaño:* ${formatBytes(media.length)}
┃ ⏳ *Expira:* Desconocido
┗━━⬣ *${dev}*
    `.trim()

    await conn.sendFile(m.chat, media, filename, txt, m, fkontak)
    await m.react(done)

  } catch (e) {
    console.error(e)
    await m.react(error)
    return conn.reply(m.chat, '❌ *Error al subir el archivo a qu.ax.*', m)
  }
}

handler.help = ['tourl3']
handler.tags = ['tools']
handler.command = ['tourl3']
handler.register = false

export default handler

async function uploadToQuax(buffer, filename) {
  const form = new FormData()
  form.append('file', buffer, filename)

  const res = await fetch('https://qu.ax/upload', {
    method: 'POST',
    body: form,
    headers: {
      ...form.getHeaders(),
      'User-Agent': 'Mozilla/5.0 (KanekiBot-MD)',
      'Accept': 'application/json'
    }
  })

  const json = await res.json()

  if (!json.url || !json.success) throw '❌ No se pudo subir el archivo a qu.ax.'

  return json.url
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}
