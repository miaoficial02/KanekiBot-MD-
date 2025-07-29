let handler = async (m, { conn }) => {
m.reply("que rico lo hiciste barboza 🤤🤤🤤🤤")
global.db.data.chats[m.chat].isBanned = false
m.react("🔥")
}
handler.admin = true
handler.command = ["unbanchat"]
export default handler
