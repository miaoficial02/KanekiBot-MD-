import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  conn.hdr = conn.hdr || {}
  if (m.sender in conn.hdr) throw '⚠️ Ya estás procesando una imagen. Espera a que termine.'

  let q = m.quoted || m
  let mime = (q.msg || q).mimetype || ''
  if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
    throw '📸 Responde a una imagen JPG o PNG con el comando `.hd` o `.remini`.'
  }

  conn.hdr[m.sender] = true
  await m.reply('🛠️ Procesando imagen en HD...')

  try {
    const imgBuffer = await q.download()
    const res = await fetch('https://image-upscaler.vercel.app/api/upscale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: imgBuffer
    })

    if (!res.ok) throw '❌ No se pudo procesar la imagen. Intenta con otra.'

    const resultBuffer = await res.buffer()
    await conn.sendFile(m.chat, resultBuffer, 'imagen-hd.jpg', '✅ Imagen mejorada con KanekiBot-MD', m)
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al mejorar la imagen. Intenta con otra diferente.')
  } finally {
    delete conn.hdr[m.sender]
  }
}

handler.help = ['hd', 'remini']
handler.tags = ['tools']
handler.command = /^(hd|remini)$/i

export default handler
