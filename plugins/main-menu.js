import sharp from "sharp";
import { promises as fs } from 'fs';
import moment from 'moment-timezone';

let handler = async (m, { conn, usedPrefix }) => {
  m.react("✨");

  let name = await conn.getName(m.sender);
  if (!global.menutext) {
    await global.menu();
  }

  let cap = global.menutext;
  let greeting = ucapan();
  let txt = `🌟 ${greeting} @${m.sender.split("@")[0]}!\n\n${cap}`;

  let mention = conn.parseMention(txt);

  try {
    let imager = await sharp('./src/doc_image.jpg').resize(400, 400).toBuffer();
    let img = await fs.readFile("./src/menu.jpg");

    await conn.sendMessage(
      m.chat,
      {
        document: img,
        fileName: "KANEKI BOT v1 | MODERN MENU",
        mimetype: "image/png",
        caption: txt,
        fileLength: 1900,
        jpegThumbnail: imager,
        contextInfo: {
          mentionedJid: mention,
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
            title: "KANEKI BOT ✨",
            body: `✨ Powered by ${wm}`,
            thumbnail: img,
            sourceUrl: "",
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    );
  } catch (e) {
    await conn.reply(m.chat, txt, m, { mentions: mention });
    await conn.reply(m.chat, "❌ Error al mostrar el menú: " + e, m);
  }

  await global.menu();
};

handler.command = ["menu", "help", "menú", "commands", "comandos", "?"];
export default handler;

function ucapan() {
  const time = moment.tz("America/Los_Angeles").format("HH");
  if (time >= 18) return "Good Night 🌙";
  if (time >= 15) return "Good Afternoon ☀️";
  if (time >= 10) return "Good Day 🌤️";
  if (time >= 4) return "Good Morning 🌅";
  return "Hello 👋";
}

global.menu = async function getMenu() {
  let text = "┏━━━━━━━━━━━━━━━┓\n";
  text += "┃       📜 𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔 📜      ┃\n";
  text += "┗━━━━━━━━━━━━━━━┛\n\n";

  let help = Object.values(global.plugins)
    .filter(plugin => !plugin.disabled)
    .map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
    }));

  let tags = {};
  for (let plugin of help) {
    if (plugin && plugin.tags) {
      for (let tag of plugin.tags) {
        if (tag) tags[tag] = tag.toUpperCase();
      }
    }
  }

  for (let category of Object.keys(tags)) {
    let cmds = await Promise.all(help
      .filter(menu => menu.tags && menu.tags.includes(category) && menu.help)
      .map(async menu => {
        return await Promise.all(menu.help
          .map(async cmd => `🔹 ${await style(cmd, 7)}`));
      }));

    if (cmds.length > 0) {
      text += `📂 ${await style(tags[category], 3)}\n`;
      text += `${cmds.map(cmdArray => cmdArray.join('\n')).join('\n')}\n\n`;
    }
  }

  text += `💠 *Use: ${usedPrefix}command*\n`;
  text += `💠 *Bot by ${wm}*\n`;

  global.menutext = text;
};

global.style = async function styles(text, style = 1) {
  var replacer = [];
  xStr.map((v, i) =>
    replacer.push({
      original: v,
      convert: yStr[style][i],
    })
  );
  var str = text.toLowerCase().split("");
  var output = [];
  str.map((v) => {
    const find = replacer.find((x) => x.original == v);
    find ? output.push(find.convert) : output.push(v);
  });
  return output.join("");
};
