
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🌤️ *Uso:* ${usedPrefix + command} <ciudad>\n\n📌 *Ejemplo:* ${usedPrefix + command} Lima`
  
  try {
    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(text)}&appid=YOUR_API_KEY&units=metric&lang=es`)
    
    // Si no tienes API key, usar un servicio alternativo
    if (res.status !== 200) {
      // Respuesta simulada para demostración
      let mockData = {
        temp: Math.floor(Math.random() * 35) + 5,
        description: ['Soleado', 'Nublado', 'Lluvioso', 'Despejado'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 100),
        wind: Math.floor(Math.random() * 20)
      }
      
      let result = `
🌤️ *Clima en ${text}*

🌡️ *Temperatura:* ${mockData.temp}°C
☁️ *Descripción:* ${mockData.description}
💧 *Humedad:* ${mockData.humidity}%
💨 *Viento:* ${mockData.wind} km/h

⚠️ *Nota:* Datos simulados (configura API key para datos reales)

👤 *Consultado por:* ${m.pushName}
      `.trim()
      
      await conn.reply(m.chat, result, m)
      return
    }
    
    let data = await res.json()
    
    let result = `
🌤️ *Clima en ${data.name}, ${data.sys.country}*

🌡️ *Temperatura:* ${data.main.temp}°C
🌡️ *Sensación térmica:* ${data.main.feels_like}°C
☁️ *Descripción:* ${data.weather[0].description}
💧 *Humedad:* ${data.main.humidity}%
💨 *Viento:* ${data.wind.speed} m/s
🔽 *Presión:* ${data.main.pressure} hPa

👤 *Consultado por:* ${m.pushName}
    `.trim()
    
    await conn.reply(m.chat, result, m)
  } catch (e) {
    throw '❌ No se pudo obtener información del clima'
  }
}

handler.help = ['clima <ciudad>']
handler.tags = ['tools']
handler.command = /^(clima|weather|tiempo)$/i

export default handler
