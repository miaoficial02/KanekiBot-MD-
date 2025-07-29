let handler = async (m, { conn }) => {
m.reply("Barboza chúpame la verga ándale 🤤🤤😣")
global.db.data.chats[m.chat].isBanned = true
m.react("🔥")
}
handler.admin = true
handler.command = ["banchat"]
export default handler
