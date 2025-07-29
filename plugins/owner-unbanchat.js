let handler = async (m, { conn }) => {
m.reply("🤤🤤🤤🤤")
global.db.data.chats[m.chat].isBanned = false
m.react("🔥")
}
handler.admin = true
handler.command = ["unbanchat"]
export default handler
