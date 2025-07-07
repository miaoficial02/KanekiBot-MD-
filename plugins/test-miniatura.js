let handler = async (m, { conn }) => {
  let texto = `✨ *MeliodasBot-MD está activo*\nEste mensaje solo tiene miniatura.`

  await conn.sendMessage(m.chat, {
    text: texto,
    contextInfo: {
      externalAdReply: {
        title: '\u200e', // carácter invisible
        body: '\u200e',  // carácter invisible
        thumbnailUrl: 'https://qu.ax/bjOsy.jpg',
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: false,
        sourceUrl: ''
      }
    }
  }, { quoted: m })
}

handler.command = /^testminiatura$/i
export default handler
