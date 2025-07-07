let handler = async (m, { conn }) => {
  let texto = `✨ *MeliodasBot-MD está activo*\nAquí va una respuesta con miniatura, sin canal, sin publicidad ni redirección.`

  await conn.sendMessage(m.chat, {
    text: texto,
    contextInfo: {
      externalAdReply: {
        title: '✅ KanekiBot-MD',
        body: 'Diseño elegante y funcional',
        thumbnailUrl: 'https://qu.ax/bjOsy.jpg', // Miniatura que aparecerá
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: false,
        sourceUrl: '' // No dirige a ningún lugar
      }
    }
  }, { quoted: m })
}

handler.command = /^testminiatura$/i
export default handler
