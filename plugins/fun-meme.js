
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    await m.reply('🎭 Generando meme...')
    
    // Lista de APIs de memes
    let apis = [
      'https://meme-api.herokuapp.com/gimme',
      'https://api.imgflip.com/get_memes'
    ]
    
    // Intentar con la primera API
    try {
      let res = await fetch(apis[0])
      let data = await res.json()
      
      if (data.url) {
        let caption = `
🎭 *Meme Random*

📝 *Título:* ${data.title || 'Sin título'}
📊 *Upvotes:* ${data.ups || 'N/A'}
🔗 *Subreddit:* r/${data.subreddit || 'memes'}

👤 *Solicitado por:* ${m.pushName}
        `.trim()
        
        await conn.sendFile(m.chat, data.url, 'meme.jpg', caption, m)
        return
      }
    } catch (e) {
      console.log('Error con primera API de memes')
    }
    
    // Memes locales como fallback
    let memeTexts = [
      '😂 Cuando tu mamá te dice que hay comida en casa',
      '🤔 Yo: Voy a dormir temprano\nTambién yo a las 3am:',
      '😅 POV: Tratas de explicar el meme a tu mamá',
      '🎮 Cuando terminas un juego y no sabes qué hacer con tu vida',
      '📱 Yo: No voy a usar tanto el teléfono\nMi tiempo de pantalla:',
      '🏃‍♂️ Corriendo a mi cuarto cuando apago las luces',
      '😴 5 minutos más de sueño'
    ]
    
    let randomMeme = memeTexts[Math.floor(Math.random() * memeTexts.length)]
    
    await conn.reply(m.chat, `
🎭 *Meme del Día*

${randomMeme}

👤 *Solicitado por:* ${m.pushName}
    `.trim(), m)
    
  } catch (e) {
    throw '❌ Error al generar meme'
  }
}

handler.help = ['meme']
handler.tags = ['fun']
handler.command = /^(meme|memes)$/i

export default handler
