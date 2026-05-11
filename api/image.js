export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt, images, size, n, model, quality } = req.body || {};

    // TEXT-TO-IMAGE (DALL-E 3) when no reference images
    if (!images || !Array.isArray(images) || images.length === 0) {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: model || 'dall-e-3',
          prompt,
          n: n || 1,
          size: size || '1792x1024',
          quality: quality || 'standard',
        }),
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    // IMAGE-TO-IMAGE (gpt-image-1 edits) with reference images
    const boundary = '----Idearchi' + Math.random().toString(16).slice(2);
    const chunks = [];

    const addText = (name, value) => {
      chunks.push(Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
        'utf-8'
      ));
    };

    addText('prompt', prompt);
    addText('model', model || 'gpt-image-1');
    addText('n', String(n || 1));
    addText('size', size || '1536x1024');
    if (quality) addText('quality', quality);

    images.forEach((imgB64, i) => {
      const buf = Buffer.from(imgB64, 'base64');
      const header =
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="image[]"; filename="ref${i}.png"\r\n` +
        `Content-Type: image/png\r\n\r\n`;
      chunks.push(Buffer.from(header, 'utf-8'));
      chunks.push(buf);
      chunks.push(Buffer.from('\r\n', 'utf-8'));
    });

    chunks.push(Buffer.from(`--${boundary}--\r\n`, 'utf-8'));
    const body = Buffer.concat(chunks);

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body,
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
