//2025 ©Bajobots
//Desarrollado por BajoBots 
//No borrar 🔥🔥

let partida = {
  jugadores: [],
  suplentes: [],
  enCurso: false,
};

const handler = async (m, { conn, args, command, usedPrefix }) => {
  const user = m.sender;
  const nombre = conn.getName(user);
  const id = `${user}`;

  // Reacciona al comando
  await m.react("🎮");

  if (command === "12vs12") {
    if (partida.enCurso) return m.reply("⚠️ Ya hay una partida en curso. Usa *.reset12* para reiniciar.");

    partida.enCurso = true;
    partida.jugadores = [];
    partida.suplentes = [];

    return conn.sendMessage(m.chat, {
      text: `🎮 *PARTIDA FREE FIRE - 12 VS 12* 🎮

🗺️ *MAPA:* Abierto
👥 *Jugadores necesarios:* 12
📦 *Suplentes disponibles:* 6
📌 *Reglas:*
- No armas de zona
- No habilidades prohibidas
- No emuladores

💬 Usa:
• *${usedPrefix}anotarse* - Para unirte
• *${usedPrefix}suplente* - Si quieres ser suplente
• *${usedPrefix}estado12* - Ver jugadores actuales
• *${usedPrefix}reset12* - Reiniciar partida

🔔 ¡Empieza a anotarte ahora!
`,
    }, { quoted: m });
  }

  if (command === "anotarse") {
    if (!partida.enCurso) return m.reply("⚠️ No hay partida activa. Usa *.12vs12* para crear una.");

    if (partida.jugadores.includes(id) || partida.suplentes.includes(id))
      return m.reply("✅ Ya estás anotado.");

    if (partida.jugadores.length < 12) {
      partida.jugadores.push(id);
      return m.reply(`✅ ${nombre} se ha unido como *Titular* (${partida.jugadores.length}/12)`);
    } else if (partida.suplentes.length < 6) {
      partida.suplentes.push(id);
      return m.reply(`📥 ${nombre} se ha unido como *Suplente* (${partida.suplentes.length}/6)`);
    } else {
      return m.reply("❌ Cupos llenos para titulares y suplentes.");
    }
  }

  if (command === "suplente") {
    if (!partida.enCurso) return m.reply("⚠️ No hay partida activa. Usa *.12vs12* para crear una.");

    if (partida.jugadores.includes(id) || partida.suplentes.includes(id))
      return m.reply("✅ Ya estás anotado.");

    if (partida.suplentes.length < 6) {
      partida.suplentes.push(id);
      return m.reply(`📥 ${nombre} se ha unido como *Suplente* (${partida.suplentes.length}/6)`);
    } else {
      return m.reply("❌ Cupos de suplentes llenos.");
    }
  }

  if (command === "estado12") {
    if (!partida.enCurso) return m.reply("⚠️ No hay partida activa.");

    let txt = `🎮 *Estado actual de la partida:*\n\n`;

    txt += `👤 *Titulares* (${partida.jugadores.length}/12):\n`;
    partida.jugadores.forEach((u, i) => {
      txt += `${i + 1}. @${u.split("@")[0]}\n`;
    });

    txt += `\n🧍‍♂️ *Suplentes* (${partida.suplentes.length}/6):\n`;
    partida.suplentes.forEach((u, i) => {
      txt += `${i + 1}. @${u.split("@")[0]}\n`;
    });

    return conn.sendMessage(m.chat, {
      text: txt.trim(),
      mentions: [...partida.jugadores, ...partida.suplentes]
    }, { quoted: m });
  }

  if (command === "reset12") {
    partida.enCurso = false;
    partida.jugadores = [];
    partida.suplentes = [];
    return m.reply("✅ Partida reiniciada con éxito.");
  }
};

handler.command = ["12vs12", "anotarse", "suplente", "estado12", "reset12"];
handler.tags = ["freefire"];
handler.help = ["12vs12", "anotarse", "suplente", "estado12", "reset12"];
handler.group = true;

export default handler;

//2025 ©Bajobots
//Desarrollado por BajoBots 
//No borrar 🔥🔥
