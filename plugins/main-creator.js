import PhoneNumber from 'awesome-phonenumber';

async function handler(m, { conn }) {
  const numcreador = '573113406369';
  const ownerJid = numcreador + '@s.whatsapp.net';

  const name = await conn.getName(ownerJid) || 'Owner';
  const about =
    (await conn.fetchStatus(ownerJid).catch(() => {}))?.status ||
    'Creador de bots de WhatsApp y del Bot Meliodas MD';
  const empresa = 'Bajo Bots - Servicios Tecnológicos';
  const imagen = 'https://qu.ax/VGCPX.jpg'; // Puedes cambiar esta imagen
  const correo = 'kleinergalindo4@gmail.com';
  const instagram = 'https://instagram.com/kleinercg';

  const caption = `
╭━━━〔 👤 *Información del Dueño* 〕━━⬣
┃ 🧑‍💼 *Nombre:* ${name}
┃ 📞 *Número:* wa.me/${numcreador}
┃ 📝 *Estado:* ${about}
┃ 🏢 *Empresa:* ${empresa}
┃ 📧 *Correo:* ${correo}
┃ 🌐 *Instagram:* ${instagram}
╰━━━━━━━━━━━━━━━━━━━━⬣

🤖 Si deseas adquirir un bot o soporte, no dudes en contactar.
`;

  await conn.sendMessage(
    m.chat,
    {
      image: { url: imagen },
      caption,
    },
    { quoted: m }
  );
}

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
