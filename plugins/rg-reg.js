import { createHash } from 'crypto';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const regFormat = /^([^\s]+)\.(\d+)\.(\w+)$/i;
    const userDB = global.db.data.users[m.sender];
    const imageUrl = 'https://files.catbox.moe/6dewf4.jpg';

    if (userDB?.registered) {
        return m.reply(`⚠️ *Ya estás registrado.*\n\nSi deseas eliminar tu registro, usa:\n➤ *${usedPrefix}unreg*`);
    }

    if (!regFormat.test(text)) {
        return m.reply(`❌ *Formato inválido.*\n\n📌 Usa el formato:\n➤ *${usedPrefix + command} Nombre.Edad.País*\n\n📍Ejemplo:\n➤ *${usedPrefix + command} Barboza.18.Venezuela*`);
    }

    let [_, name, age, country] = text.match(regFormat);
    age = parseInt(age);

    if (!name || name.length > 50) return m.reply('🚫 *Nombre inválido o demasiado largo.*');
    if (isNaN(age) || age < 5 || age > 100) return m.reply('🚫 *Edad no válida. Debe estar entre 5 y 100 años.*');
    if (!country || country.length > 30) return m.reply('🚫 *País inválido o demasiado largo.*');

    const userHash = createHash('md5').update(m.sender).digest('hex');

    global.db.data.users[m.sender] = {
        name,
        age,
        country,
        registered: true,
        regTime: Date.now(),
        id: userHash
    };

    const confirmMsg = `
┏━━━『 ✅ 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗢 𝗘𝗫𝗜𝗧𝗢𝗦𝗢 』━━━┓
┃
┃ 👤 *Nombre:* ${name}
┃ 🎂 *Edad:* ${age} años
┃ 🌎 *País:* ${country}
┃ 🆔 *ID:* ${userHash.slice(0, 12)}...
┃
┃ 📌 ¡Tus datos han sido guardados!
┗━━━━━━━━━━━━━━━━━━━━━━━┛`.trim();

    await conn.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: confirmMsg
    });

    await conn.sendMessage(m.chat, {
        text: `✅ *Verificación completada*\n\nBienvenido a *KanekiBot*. Ya estás registrado en el sistema.`,
    });
};

handler.help = ['registrar <nombre.edad>'];
handler.tags = ['registro'];
handler.command = ['registrar', 'reg'];

export default handler;
