export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const TOKEN = 'tkzqlx+erMpQwg21AiUOL+fZvJtXHf/pjV0NqvHuwi/dZ4ws0hL2k7CJdVWE9CU9q+BVyWFck+nEHE9EvOXunXhp2GntBOQ9ukf8iE8UnhzLfN8nM78IeifLtTP34iwmP/RXoFxEcs5+GR+7XrW0GwdB04t89/1O/w1cDnyilFU=';
  const USER_ID = 'U220888fc8aae5781571b9c1f9e2a18ac';

  const body = req.body;

  // 判斷是哪種通知
  let msg = '';

  if (body.type === 'registration') {
    // 開票登記通知
    msg = body.message;
  } else if (body.name && body.phone && body.date) {
    // 購票須知同意書通知
    msg = `📋 購票規則同意通知\n━━━━━━━━━━━━━\n👤 姓名：${body.name}\n📱 手機：${body.phone}\n📅 日期：${body.date}\n✅ 已勾選同意所有購票規則`;
  } else if (body.date) {
    // 舊版相容
    msg = body.date;
  } else {
    msg = JSON.stringify(body);
  }

  const response = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
    body: JSON.stringify({
      to: USER_ID,
      messages: [{ type: 'text', text: msg }]
    })
  });

  const data = await response.json();
  return res.status(response.ok ? 200 : 400).json(data);
}
