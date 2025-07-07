global.respuestaMini = async (conn, m, texto, miniatura = 'https://qu.ax/RkiEC.jpg') => {
  await conn.sendMessage(m.chat, {
    text: texto,
    contextInfo: {
      externalAdReply: {
        title: '\u200e',
        body: '\u200e',
        thumbnailUrl: miniatura,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: false,
        sourceUrl: ''
      }
    }
  }, { quoted: m })
}
