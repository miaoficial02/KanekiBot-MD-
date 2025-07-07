import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import fs from 'fs'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'

// 👤 Dueños y colaboradores
global.owner = [
  ['573162402768', 'Bajo Bots', true],
]

// ⚙️ APIs oficiales
global.APIs = {
  xteam: 'https://api.xteam.xyz',
  fgmods: 'https://api-fgmods.ddns.net',
  zenz: 'https://zenzapis.xyz'
}
global.APIKeys = {
  'https://api.xteam.xyz': 'd90a9e986e18778b',
  'https://zenzapis.xyz': '675e34de8a',
  'https://api-fgmods.ddns.net': 'TU-APIKEY'
}

// 🛠️ Personalización general
global.prefijo = '' // vacío para multi-prefijo
global.packname = '𝐊𝐚𝐧𝐞𝐤𝐢𝐁𝐨𝐭-𝐌𝐃 ⚙️'
global.author = '🧠 Bajo Bots'
global.footer = '> Bʏ KᴀɴᴇᴋɪBᴏᴛ-MD'
global.wm = '𝘾𝙤𝙙𝙚 𝙗𝙮 𝘽𝙖𝙟𝙤 𝘽𝙤𝙩𝙨'
global.logo = 'https://qu.ax/tyxJP.jpg'
global.link = 'https://chat.whatsapp.com/IVgxD0TWWuSA0lVoexudIS'

// 🔄 Emojis de estado
global.wait = '*Cargando...*'
global.rwait = '⌛'
global.done = '✅'
global.error = '❌'
global.xmoji = '🔥'
global.dmoji = '🤖'

// 🖼️ Imágenes y recursos
global.imagen = fs.readFileSync('./src/img.jpg')
global.icono = global.logo

// 📦 Librerías integradas
global.fs = fs
global.fetch = fetch
global.axios = axios
global.cheerio = cheerio
global.moment = moment

// 📁 Rutas de sesión
global.Sesion = 'Data/Sesiones/Principal'
global.jadi = 'Data/Sesiones/Subbots'
global.dbname = 'Data/database.json'

// ⏱️ Tiempo y fecha
let d = new Date(new Date + 3600000)
global.dia = d.toLocaleDateString('es', { weekday: 'long' })
global.fecha = d.toLocaleDateString('es', { day: 'numeric', month: 'numeric', year: 'numeric' })
global.mes = d.toLocaleDateString('es', { month: 'long' })
global.año = d.toLocaleDateString('es', { year: 'numeric' })
global.tiempo = d.toLocaleString('es-CO', { hour: 'numeric', minute: 'numeric', second: 'numeric' })
global.botdate = `📆 Fecha: ${moment.tz('America/Bogota').format('DD/MM/YY')}`
global.bottime = `⏰ Hora: ${moment.tz('America/Bogota').format('HH:mm:ss')}`

// ⚔️ Nivel y advertencias
global.multiplier = 150
global.maxwarn = 2

// 📢 Mensajes RC Canal con imagen por link
global.rc_canal = {
  key: {
    remoteJid: 'status@broadcast',
    participant: '0@s.whatsapp.net'
  },
  message: {
    extendedTextMessage: {
      text: '🧠 KanekiBot-MD • Conectado con la red de Bajo Bots.',
      matchedText: '',
      canonicalUrl: '',
      description: '',
      title: 'KanekiBot-MD',
      previewType: 'PHOTO',
      jpegThumbnailUrl: 'https://qu.ax/tyxJP.jpg',
      thumbnailUrl: 'https://qu.ax/tyxJP.jpg',
      renderLargerThumbnail: true
    }
  }
}

// 🔁 Recarga automática del archivo
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("✅ Config actualizada: 'config-kaneki.js'"))
  import(`${file}?update=${Date.now()}`)
})
