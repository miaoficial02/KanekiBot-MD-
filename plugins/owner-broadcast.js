import { readFileSync } from 'fs'

let handler = async (m, { conn, text, participants, isROwner, isOwner }) => {
  if (!text) throw '⚠️ *Ingrese el mensaje a transmitir*'

  let users = Object.entries(global.db.data.users).filter(user => user[1].registered == true)
  let cc = text ? m : m.quoted ? await m.getQuotedObj() : false || m
  let teks = text ? text : cc.text
  let content = await conn.cMod(m.chat, cc, /bc|broadcast/i.test(teks) ? teks : '*📢 MENSAJE OFICIAL 📢*\n\n' + teks)

  for (let [jid] of users) {
    await conn.copyNForward(jid, content, true)
  }

  conn.reply(m.chat, `✅ *Mensaje enviado a ${users.length} usuarios registrados*`, m)
}