import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`╭━━🎧 *𝙎𝙥𝙤𝙩𝙞𝙛𝙮 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙𝙚𝙧* ━━⬣
┃ ✨ *Uso correcto:* 
┃ ${usedPrefix + command} *nombre de la canción*
┃
┃ 🧪 *Ejemplo:* 
┃ ${usedPrefix + command} stay - justin bieber
╰━━━━━━━━━━━━━━━━⬣`)
  }

  await m.react('🎶')

  try {
    const res = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.result || !json.result.downloadUrl) {
      return m.reply('❌ No se encontró la canción. Intenta con otro nombre.')
    }

    let info = `╭─❍ *𝑺𝒑𝒐𝒕𝒊𝒇𝒚 𝑹𝒆𝒔𝒖𝒍𝒕𝒂𝒅𝒐* ❍─⬣
│ 🎵 *Título:* ${json.result.title}
│ 👤 *Artista:* ${json.result.artists}
│ 💽 *Álbum:* ${json.result.album}
│ ⏱️ *Duración:* ${json.result.duration}
│ 🔗 *Link:* ${json.result.url}
╰───────────────⬣`

    await conn.sendMessage(m.chat, {
      image: { url: json.result.thumbnail },
      caption: info,
      contextInfo: {
        externalAdReply: {
          title: '🎧 ¡Descarga exitosa!',
          body: 'Spotify Downloader | KanekiBot-MD',
          thumbnailUrl: json.result.thumbnail,
          sourceUrl: json.result.url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      audio: { url: json.result.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${json.result.title}.mp3`,
      ptt: false
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.reply('❌ Ocurrió un error al procesar tu solicitud. Intenta más tarde.')
  }
}

handler.help = ['music *<nombre>*']
handler.tags = ['descargar']
handler.command = ['music', 'spotify2', 'spotifydl']

export default handler
  
