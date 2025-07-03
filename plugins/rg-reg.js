import {createHash} from 'crypto';
const Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;
const handler = async function(m, {conn, text, usedPrefix, command}) {
  const user = global.db.data.users[m.chat][m.sender];
  const name2 = conn.getName(m.sender);
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch((_) => imagen);
  if (user.registered === true) throw `🌺 Ya estás registrado, no puedes volver a hacerlo.`;
  if (!Reg.test(text)) throw `🌴 Formato incorrecto.Ejemplo: *${usedPrefix}reg Fz.18*_`;
  let [_, name, splitter, age] = text.match(Reg);
  if (!name) throw '🌾 Ingresa un nombre válido.';
  if (!age) throw '🌿 Ingresa una edad válida.';
  if (name.length >= 20) throw '🍄 El nombre no debe tener más de 20 caracteres.';
  age = parseInt(age);
  if (age >= 70) throw '¿De verdad?';
  if (age <= 5) throw '🍓 Pon una edad válida.';
  user.name = name.trim();
  user.age = age;
  user.regTime = + new Date;
  user.registered = true;
  const sn = createHash('md5').update(m.sender).digest('hex');
  const caption = `
🌱 \`Nombre :\` _${name}_
🌸 \`Edad :\` _${age} años_

🏝️ \`Número de serie :\`
${sn}`;
  await conn.sendFile(m.chat, pp, 'user.jpg', caption);
  global.db.data.users[m.chat][m.sender].coin += 10000;
  global.db.data.users[m.chat][m.sender].exp += 10000;
  global.db.data.users[m.chat][m.sender].diamond += 30;
};
handler.help = ['verificar'];
handler.tags = ['econ'];
handler.command = /^(verify|register|verificar|reg|registrar)$/i;
export default handler;
