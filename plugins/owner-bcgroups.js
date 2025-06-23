import { readFileSync } from 'fs'

let handler = async (m, { conn, text, participants, isROwner, isOwner }) => {
  if (!text) throw '⚠️ *Ingrese el mensaje a transmitir*'

  let groups = Object.entries(global.db.data.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && !chat.isBanned && chat.welcome)
  let cc = text ? m : m.quoted ? await m.getQuotedObj() : false || m
  let teks = text ? text : cc.text
  let content = await conn.cMod(m.chat, cc, /bc|broadcast/i.test(teks) ? teks : '*📢 MENSAJE OFICIAL 📢*\n\n' + teks)

  for (let [jid] of groups) {
    await conn.copyNForward(jid, content, true)
  }

  conn.reply(m.chat, `✅ *Mensaje enviado a ${groups.length} grupos*`, m)
}
```handler.help = ['broadcast', 'bc'].map(v => v + ' <texto>')
handler.tags = ['owner']
handler.command = ['broadcast', 'bc']
handler.owner = true

export default handler