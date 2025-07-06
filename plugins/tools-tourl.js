import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (!mime) return conn.reply(m.chat, `📌 Por favor, responde a una *imagen* o *video* para subir.`, m)

  const rwait = '🔄'
  const done = '✅'
  const error = '❌'
  const dev = 'KanekiBot-MD'
  const fkontak = null // Puedes cambiar esto por un contacto falso o dejarlo en null

  await m.react(rwait)

  try {
    let media = await q.download()
    let isImageOrVideo = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)

    let link = await (isImageOrVideo ? uploadImage : uploadFile)(media)

    let txt = `┏━━⬣「 *E N L A C E - G E N E R A D O* 」⬣\n`
    txt += `┃ 🔗 *Link:* ${link}\n`
    txt += `┃ ✂️ *Acortado:* ${await shortUrl(link)}\n`
    txt += `┃ 📦 *Tamaño:* ${formatBytes(media.length)}\n`
    txt += `┃ ⏳ *Expiración:* ${isImageOrVideo ? 'No expira' : 'Desconocido'}\n`
    txt += `┗━━⬣ *${dev}*`

    await conn.sendFile(m.chat, media, 'upload.jpg', txt, m, fkontak)
    await m.react(done)
  } catch (e) {
    console.error(e)
    await m.react(error)
    return conn.reply(m.chat, '❌ Error al subir el archivo o generar enlace.', m)
  }
}

handler.help = ['tourl']
handler.tags = ['tools']
handler.command = ['tourl', 'upload']
handler.register = false

export default handler

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

async function shortUrl(url) {
  let res = await fetch(`https://api.lolhuman.xyz/api/urltoimg?apikey=b8d3bec7f13fa5231ba88431&url=}`)
  return await res.text()
}
