
import { xpRange } from '../lib/levelling.js'
import { promises } from 'fs'
import { join } from 'path'

let tags = {
  'main': 'PRINCIPAL',
  'game': 'JUEGOS',
  'rpg': 'RPG',
  'rg': 'REGISTRO',
  'xp': 'EXPERIENCIA',
  'sticker': 'STICKERS',
  'anime': 'ANIME',
  'database': 'DATABASE',
  'fix': 'FIXMSGESPERA',
  'grupo': 'GRUPOS',
  'nable': 'HABILITAR/DESHABILITAR', 
  'descargas': 'DESCARGAS',
  'youtube': 'YOUTUBE',
  'tools': 'HERRAMIENTAS',
  'fun': 'DIVERSIÓN',
  'audio': 'AUDIOS',
  'serbot': 'SUB BOTS',
  'owner': 'OWNER',
  'advanced': 'AVANZADO'
}

const defaultMenu = {
  before: `┌─⊷ *𝙆𝘼𝙉𝙀𝙆𝙄 𝘽𝙊𝙏 - 𝙈𝘿* 🤖
▢ Creador: *𝐁𝐚𝐣𝐨𝐁𝐨𝐭𝐬*
▢ Versión: ${vs}
▢ Prefijo: [ ${global.prefix} ]
▢ Usuario: *%name*
▢ Nivel: *%level* 
▢ XP: *%totalexp*
▢ Rango: *%role*
▢ Fecha: *%week %weton*
▢ Tiempo Activo: *%muptime*
└─⊷ *%totalreg* usuarios registrados

%readmore`.trimStart(),
  header: '┌─⊷ *%category*',
  body: '▢ %cmd %islimit %isPremium',
  footer: '└─⊷\n',
  after: `> 🤍 *Powered by ${global.author}*`,
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let meh = global.imagen1
    let package_ = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, limit, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == conn.user.jid ? '' : `Powered by https://wa.me/${conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Limit)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Premium)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.getName(conn.user.jid),
      npmname: package_.name,
      npmdesc: package_.description,
      version: package_.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: package_.homepage ? package_.homepage.url || package_.homepage : '[unknown github url]',
      level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

    const pp = await conn.profilePictureUrl(conn.user.jid).catch(_ => 'https://i.ibb.co/rdTRKNk/avatar-contact.png')
    
    conn.sendFile(m.chat, meh, 'menu.jpg', text.trim(), m, false, {
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363386072928497@newsletter',
          newsletterName: global.author,
          serverMessageId: -1
        },
        businessMessageForwardInfo: { businessOwnerJid: conn.decodeJid(conn.user.id) },
        forwardingScore: 256,
      }
    })

  } catch (e) {
    conn.reply(m.chat, '❌ *Error al generar el menú*', m)
    throw e
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú'] 
handler.register = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
