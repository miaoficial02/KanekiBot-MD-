const handler = async (m, { isOwner, isGroup, conn }) => {
  // Ignorar si es grupo
  if (isGroup) return;

  // Permitir solo si es owner
  if (isOwner) return;

  // Si no es owner y está en privado: bloquear el comando
  await conn.reply(m.chat, `
┏━━━━━━༻𓃠༺━━━━━━┓
┃  🚫 *KANEKIBOT-MD*
┃  No puedes usar comandos por privado.
┃
┃  🔗 Escribe al owner si deseas permiso:
┃  wa.me/573162402768
┗━━━━━━༻𓃠༺━━━━━━┛
  `, m);

  // Prevenir ejecución del comando
  return !0;
};

export default handler;
handler.before = true;
