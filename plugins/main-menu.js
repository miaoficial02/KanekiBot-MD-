import { xpRange } from '../lib/levelling.js';

// Reloj: uptime en formato hh:mm:ss
const clockString = ms => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

// Video tipo GIF
const videoUrl = "https://cdn.russellxz.click/f630e442.mp4";

const menuHeader = `
┏━『 ✦ 𝙹𝚄𝙹𝚄𝚃𝚂𝚄 𝙺𝙰𝙸𝚂𝙴𝙽 ✦ 』━┓
┃ 🧩 𝙽𝚘𝚖𝚋𝚛𝚎: 𝑨 %name
┃ 🧩 𝙽𝚒𝚟𝚎𝚕: %level | 𝑿𝑷: %exp/%max
┃ 🧩 𝙻í𝚖𝚒𝚝𝚎: %limit | 𝙼𝚘𝚍𝚘: %mode
┃ 🧩 𝚄𝚙𝚝𝚒𝚖𝚎: %uptime
┃ 🧩 𝚄𝚜𝚞𝚊𝚛𝚒𝚘𝚜: %total
┃ 🧩 𝙱𝚘𝚝 𝙾𝚙𝚝𝚒𝚖𝚒𝚣𝚊𝚍𝚘 🚀
┗━━━━━━━━━━━━━━━━━━━┛
`.trim();

const sectionDivider = '⏤͟͟͞͞⏤͟͟͞͞⏤͟͟͞͞⏤͟͟͞͞⏤͟͟͞͞⏤͟͟͞͞';

const menuFooter = `
┏━『 ✦ 𝚈𝚄𝚃𝙰 ✦ 』━┓
┃ Gracias por usar este bot.
┗━━━━━━━━━━━━━━━━┛
`.trim();

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const user = global.db?.data?.users?.[m.sender] || { level: 1, exp: 0, limit: 5 };
    const { exp, level, limit } = user;
    const { min, xp } = xpRange(level, global.multiplier || 1);
    const totalreg = Object.keys(global.db?.data?.users || {}).length;

    const mode = global.opts?.self ? 'Privado 🔒' : 'Público 🌐';
    const uptime = clockString(process.uptime() * 1000);

    let name = "Usuario";
    try { name = await conn.getName(m.sender); } catch {}

    let categorizedCommands = {};
    Object.values(global.plugins)
      .filter(p => p?.help && !p.disabled)
      .forEach(p => {
        const tags = Array.isArray(p.tags) ? p.tags : [typeof p.tags === 'string' ? p.tags : 'Otros'];
        const tag = tags[0] || 'Otros';
        const commands = Array.isArray(p.help) ? p.help : [p.help];
        categorizedCommands[tag] = categorizedCommands[tag] || new Set();
        commands.forEach(cmd => categorizedCommands[tag].add(cmd));
      });

    const emojis = {
      anime: "🌸", info: "ℹ️", search: "🔎", diversión: "🎉",
      subbots: "🤖", rpg: "🌀", registro: "📝", sticker: "🎨",
      imagen: "🖼️", logo: "🖌️", configuración: "⚙️", premium: "💎",
      descargas: "📥", herramientas: "🛠️", nsfw: "🔞",
      "base de datos": "📀", audios: "🔊", "free fire": "🔥",
      otros: "🪪"
    };

    const orderedTags = [
      "anime", "info", "search", "diversión", "subbots", "rpg",
      "registro", "sticker", "imagen", "logo", "configuración",
      "premium", "descargas", "herramientas", "nsfw", "base de datos",
      "audios", "free fire", "otros"
    ];

    const menuBody = orderedTags.filter(tag => categorizedCommands[tag]).map(tag => {
      const emoji = emojis[tag] || "✦";
      const entries = [...categorizedCommands[tag]].map(cmd =>
        `┃ ✧ _${_p}${cmd}_`
      ).join('\n');
      return `┏━『 ${emoji} ${tag.toUpperCase()} 』━┓\n${entries}\n${sectionDivider}`;
    }).join('\n\n');

    const finalHeader = menuHeader
      .replace('%name', name)
      .replace('%level', level)
      .replace('%exp', exp - min)
      .replace('%max', xp)
      .replace('%limit', limit)
      .replace('%mode', mode)
      .replace('%uptime', uptime)
      .replace('%total', totalreg);

    const fullMenu = `╭─────────────⟢
${finalHeader}

${menuBody}

${menuFooter}
╰─────────────⟢`;

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      gifPlayback: true,
      caption: fullMenu,
      mentions: [m.sender]
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '⚠️ Error al generar el menú.', m);
  }
};

handler.command = ['menu', 'help', 'menú'];
export default handler;
