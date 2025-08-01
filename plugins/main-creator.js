import fetch from 'node-fetch';
import PhoneNumber from 'awesome-phonenumber';

async function handler(m, { conn }) {
  const numcreador = '573113406369';
  const ownerJid = numcreador + '@s.whatsapp.net';

  const name = await conn.getName(ownerJid) || 'Owner';
  const about =
    (await conn.fetchStatus(ownerJid).catch(() => {}))?.status ||
    'Creador de bots de WhatsApp y del Bot Meliodas MD';
  const empresa = 'Bajo Bots - Servicios Tecnológicos';
  const imagen = 'https://qu.ax/VGCPX.jpg';
  const correo = 'kleinergalindo4@gmail.com';
  const instagram = 'https://instagram.com/kleinercg';

  const caption = `
╭══ 🎭 *KANEKI BOT OWNER* ══⬣
┃ 👤 *Nombre:* ${name}
┃ 📱 *Número:* wa.me/${numcreador}
┃ 📝 *Estado:* ${about}
┃ 🏢 *Empresa:* ${empresa}
┃ 📧 *Correo:* ${correo}
┃ 🌐 *Instagram:* ${instagram}
╰════════════════════════⬣

📌 *¿Necesitas un bot, soporte o desarrollo personalizado?*
✉️ Escríbele directamente al número del creador.
`.trim();

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: "CREADOR 👾",
        jpegThumbnail: await (await fetch('https://iili.io/F8Y2bS9.jpg')).buffer(),
        vcard:
          "BEGIN:VCARD\n" +
          "VERSION:3.0\n" +
          "N:;Unlimited;;;\n" +
          "FN:Unlimited\n" +
          "ORG:Unlimited\n" +
          "TITLE:\n" +
          "item1.TEL;waid=19709001746:+1 (970) 900-1746\n" +
          "item1.X-ABLabel:Unlimited\n" +
          "X-WA-BIZ-DESCRIPTION:ofc\n" +
          "X-WA-BIZ-NAME:Unlimited\n" +
          "END:VCARD"
      }
    },
    participant: "0@s.whatsapp.net"
  };

  await conn.sendMessage(
    m.chat,
    {
      image: { url: imagen },
      caption,
    },
    { quoted: fkontak }
  );
}

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
