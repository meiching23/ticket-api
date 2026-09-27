export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const TOKEN = 'nb7EChDsthza7diKHbYLm8UQjDbXrf5M7XRXuXiY+1lnLIoLdB81PzygNghRzL5Uq+BVyWFck+nEHE9EvOXunXhp2GntBOQ9ukf8iE8UnhzXigbJc3HKGzfSKtkXLrW+mhkdeOxki+CUG9wrh7A14AdB04t89/1O/w1cDnyilFU=';
  const USER_ID = 'U220888fc8aae5781571b9c1f9e2a18ac';
  const GROUP_ID = 'C0409981af74da73014be53891e1bd1e3';       // 開票登記 & 同意書群組
  const ORDER_GROUP_ID = 'Ce6d5e00d91a04850b5a3d3288f6c7be4'; // 業務下單群組

  const body = req.body;

  let msg = '';
  let targetId = GROUP_ID;

  if (body.type === 'order') {
    // 業務下單通知 → 業務下單群組
    msg = body.message;
    targetId = ORDER_GROUP_ID;
  } else if (body.type === 'registration') {
    // 開票登記通知 → 開票群組
    msg = body.message;
    targetId = GROUP_ID;
  } else if (body.name && body.phone && body.date) {
    // 購票同意書通知 → 開票群組
    msg = `📋 購票規則同意通知\n━━━━━━━━━━━━━\n👤 姓名：${body.name}\n📱 手機：${body.phone}\n📅 回簽日期：${body.date}\n✅ 已勾選同意所有購票規則`;
    targetId = GROUP_ID;
  } else if (body.date) {
    msg = body.date;
    targetId = GROUP_ID;
  } else {
    msg = JSON.stringify(body);
    targetId = GROUP_ID;
  }

  const response = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
    body: JSON.stringify({
      to: targetId,
      messages: [{ type: 'text', text: msg }]
    })
  });

  const data = await response.json();
  console.log('LINE status:', response.status, 'body:', JSON.stringify(data));
  return res.status(200).json({ lineStatus: response.status, lineBody: data, msg });
}
