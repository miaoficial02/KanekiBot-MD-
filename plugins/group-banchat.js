let handler = async (m,  conn, isAdmin, isROwner ) => 
  if (!(isAdmin || isROwner)) 
    await m.react('❌');
    return dfail('admin', m, conn);
  

  global.db.data.chats[m.chat].isBanned = true;

  const adminTag = `@{m.sender.split('@')[0]}`;

  await conn.reply(m.chat, `
🔒 *BLOQUEO ACTIVADO*
━━━━━━━━━━━━━━━━━━
🤖 *Kaneki Bot* ha sido *baneado* en este chat.

🧑‍💼 *Administrador:* adminTag
🛡️ *Estado:* Inactivo en este grupo

Para reactivarlo usa *.desbanearbot*
━━━━━━━━━━━━━━━━━━
`, m, 
    mentions: [m.sender]
  );

  console.log(`📛 Chat{m.chat} baneado por ${m.sender}`);
  await m.react('🚫');
};

handler.help = ['banearbot'];
handler.tags = ['group'];
handler.command = ['banearbot', 'banchat'];
handler.group = true;

export default handler;
```
