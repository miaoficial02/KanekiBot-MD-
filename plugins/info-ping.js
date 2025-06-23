
import { cpus as _cpus, totalmem, freemem } from 'os'
import util from 'util'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'

let format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})

let handler = async (m, { conn, usedPrefix, command }) => {
  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'))
  const used = process.memoryUsage()
  const cpus = _cpus().map(cpu => {
    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
    return cpu
  })
  const cpu = cpus.reduce((last, cpu, _, { length }) => {
    last.total += cpu.total
    last.speed += cpu.speed / length
    last.times.user += cpu.times.user
    last.times.nice += cpu.times.nice
    last.times.sys += cpu.times.sys
    last.times.idle += cpu.times.idle
    last.times.irq += cpu.times.irq
    return last
  }, {
    speed: 0,
    total: 0,
    times: {
      user: 0,
      nice: 0,
      sys: 0,
      idle: 0,
      irq: 0
    }
  })

  let timestamp = performance.now()
  let latensi = performance.now() - timestamp
  let neww = performance.now()
  let oldd = performance.now()

  let respon = `
🏓 *PONG!*
📊 *Velocidad de Respuesta:* ${latensi.toFixed(4)} ms
📈 *Velocidad del Bot:* ${oldd - neww} ms

💻 *Info del Servidor:*
🔧 *RAM:* ${format(totalmem() - freemem())} / ${format(totalmem())}
📱 *Chats Privados:* ${chats.length - groupsIn.length}
👥 *Chats Grupales:* ${groupsIn.length}
💬 *Total de Chats:* ${chats.length}

⚡ *Rendimiento:*
${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${format(used[key])}`).join('\n')}

💾 *CPU Info:*
${cpus[0] ? `${cpus[0].model.trim()} (${cpu.speed} MHz)` : 'No disponible'}
`.trim()

  await conn.reply(m.chat, respon, m)
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = /^ping$/i

export default handler
