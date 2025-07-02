// 📦 Importaciones
import { xpRange } from '../lib/levelling.js';

// 🕒 Función de conversión de tiempo
const clockString = ms => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

// 🖼️ Imagen del menú
const imagen = "https://qu.ax/aWUXr.jpg";

// 📝 Encabezado del menú
const menuHeader = `
  🐉 KanekiBot-MD 🐉 
┃ ¡Hola, %name!
┃ Nivel: %level | XP: %exp/%max
┃ Límite: %limit | Modo: %mode
┃ Uptime: %uptime | Usuarios: %total
`;

// 🚧 Separador de secciones (vacío por ahora)
const sectionDivider = ``;

// 📝 Pie de página del menú
const menuFooter = `
╭
│ 💡 𝐮𝐬𝐚 𝐜𝐚𝐝𝐚 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐜𝐨𝐧 𝐬𝐮 𝐩𝐫𝐞𝐟𝐢𝐣𝐨.
│ ✨ 𝐞𝐥 𝐛𝐨𝐭 𝐩𝐞𝐫𝐟𝐞𝐜𝐭𝐨 𝐩𝐚𝐫𝐚 𝐭𝐮 𝐠𝐫𝐮𝐩𝐨.
│ 🛠 𝐝𝐞𝐬𝐚𝐫𝐫𝐨𝐥𝐥𝐚𝐝𝐨 𝐩𝐨𝐫 @𝐁𝐚𝐣𝐨-𝐁𝐨𝐭𝐬
╰
`;

// 🔥 Manejador principal del comando
let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    // 📊 Datos del usuario y del bot
    const user = global.db.data.users[m.sender] || { level: 1, exp: 0, limit: 5 };
    const { exp, level, limit } = user;
    const { min, xp } = xpRange(level, global.multiplier || 1);
    const totalreg = Object.keys(global.db?.data?.users || {}).length;
    const mode = global.opts?.self ? 'Privado 🔒' : 'Público 🌐';
    const uptime = clockString(process.uptime() * 1000);
    const name = await conn.getName(m.sender) || "Usuario";

    if (!global.plugins) return conn.reply(m.chat, '❌ Plugins no cargados correctamente.', m);

    // 📚 Categorías del menú
    let categorizedCommands = {
      "ℹ️ Info": new Set(),
      "🔎 Search": new Set(),
      "🎮 Game": new Set(),
      "🤖 SubBots": new Set(),
      "📝 Registro": new Set(),
      "🎨 Sticker": new Set(),
      "🖼️ Imagen": new Set(),
      "🖌️ Logo": new Set(),
      "⚙️ Configuración": new Set(),
      "📥 Descargas": new Set(),
      "🛠️ Herramientas": new Set(),
      "📀 Base de Datos": new Set(),
      "🔥 Free Fire": new Set(),
      "Otros": new Set()
    };

    // 📂 Clasificación de comandos por categorías
    for (const plugin of Object.values(global.plugins)) {
      if (plugin?.help && !plugin.disabled) {
        const cmds = Array.isArray(plugin.help) ? plugin.help : [plugin.help];
        const tagKey = Object.keys(categorizedCommands).find(key => {
          const clean = key.replace(/[^a-z]/gi, '').toLowerCase();
          return plugin.tags?.includes(clean);
        }) || "Otros";

        cmds.forEach(cmd => categorizedCommands[tagKey].add(cmd));
      }
    }

    // 🧩 Construcción del cuerpo del menú
    const menuBody = Object.entries(categorizedCommands)
      .filter(([_, cmds]) => cmds.size > 0)
      .map(([title, cmds]) => {
        const entries = [...cmds].map(cmd => {
          const plugin = Object.values(global.plugins).find(p =>
            Array.isArray(p.help) ? p.help.includes(cmd) : p.help === cmd
          );
          const premium = plugin?.premium ? '💎' : '';
          const limited = plugin?.limit ? '🌀' : '';
          return `┊† 🐉 _${_p}${cmd}_ ${premium}${limited}`.trim();
        }).join('\n');

        return `⏤͟͟͞͞★「 ${title} 」\n${entries}\n${sectionDivider}`;
      }).join('\n\n');

    // 🖇️ Personalizar encabezado con datos reales
    const finalHeader = menuHeader
      .replace('%name', name)
      .replace('%level', level)
      .replace('%exp', (exp - min))
      .replace('%max', xp)
      .replace('%limit', limit)
      .replace('%mode', mode)
      .replace('%uptime', uptime)
      .replace('%total', totalreg);

    // 📬 Enviar menú final
    const fullMenu = `${finalHeader}\n\n${menuBody}\n\n${menuFooter}`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: imagen },
      caption: fullMenu,
      mentions: [m.sender]
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '⚠️ Error al generar el menú. Intenta de nuevo.', m);
  }
};

// 📝 Comandos que activan el manejador
handler.command = ['menu', 'help', 'menú'];

// 🚩 Exportar handler
export default handler;
