import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

global.owner = [
   ['573162402768', 'BajoBots', true],
   ['', '', true],
   ['', '', true]
]

global.creadorbot = [
   ['573162402768', 'BajoBots', true]
]

global.mods = ['573162402768', '573162402768']
global.prems = ['573162402768']


global.packname = '𝙆𝙖𝙣𝙚𝙠𝙞 𝙐𝙡𝙩𝙧𝙖'
global.botname = '𝐊𝐚𝐧𝐞𝐤𝐢𝐁𝐨𝐭-𝐌𝐃'
global.wm = '⏤͟͟͞͞⋆⬪࣪ꥈ☕★ ׄ ꒱ Kᴀɴᴇᴋɪ ୭'
global.author = '𝘌𝘥𝘪𝘵 𝘉𝘺 𝘉𝘢𝘫𝘰'
global.dev = '©ℙ𝕠𝕨𝕖𝕣 𝕓𝕪 𝕓𝕒𝕛𝕠 𝕓𝕠𝕥𝕤 𝕔𝕠𝕞𝕦𝕟𝕚𝕥𝕪'
global.errorm = 'Error: ${error.message}'
global.nombrebot = '𝐊𝐀𝐍𝐄𝐊𝐈 𝐁𝐎𝐓 - 𝐌𝐃'
global.textbot = `「 𝙆𝘼𝙉𝙀𝙆𝙄 𝘽𝙊𝙏 - 𝙈𝘿 」`
global.vs = '3.0.0'


global.imagen1 = fs.readFileSync('./media/menus/Menu.jpg')
global.imagen2 = fs.readFileSync('./media/menus/Menu2.jpg')
global.imagen3 = fs.readFileSync('./media/menus/Menu3.jpg')
global.welcome = fs.readFileSync('./media/welcome.jpg')
global.adios = fs.readFileSync('./media/adios.jpg')
global.catalogo = fs.readFileSync('./media/catalogo.jpg')
global.shadowurl = fs.readFileSync('./media/kanekiurl.jpg')


global.repobot = 'https://github.com/Kone457'
global.grupo = 'https://chat.whatsapp.com/IVgxD0TWWuSA0lVoexudIS'
global.comu = ''
global.channel = 'https://whatsapp.com/channel/0029VbAY63K0gcfPaK8Y7r2k'
global.insta = ''


global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "543876577197-120363317332020195@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: 'MOONFORCE 乂 TEAM', orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}


global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment        


global.multiplier = 69 
global.maxwarn = '3'
global.autoReply = true

// Configuración para respuesta automática del bot
global.autoReply = true // true para activar el sistema, false para desactivar


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
