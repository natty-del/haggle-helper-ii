const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { image, location, textOnly, itemName } = req.body;

    try {
        let messages;

        if (textOnly && itemName) {
            messages = [{
                role: 'user',
                content: `You are a Vietnam market price expert. Give a fair local price estimate for: "${itemName}"

Location context: ${location || 'Vietnam'}

Respond ONLY with valid JSON in this exact format:
{
  "item": "item name",
  "description": "brief description",
  "estimatedPrice": { "min": 15000, "max": 25000 },
  "confidence": "medium",
  "hagglingTips": ["tip 1", "tip 2", "tip 3"]
}

Use Vietnamese Dong (VND) amounts as plain integers. No markdown, no explanation, just JSON.`
            }];
        } else if (image) {
            messages = [{
                role: 'user',
                content: [
                    {
                        type: 'image',
                        source: { type: 'base64', media_type: 'image/jpeg', data: image }
                    },
                    {
                        type: 'text',
                        text: `You are a Vietnam market price expert. Analyze this photo of a product or price tag.

Location: ${location || 'Vietnam'}

Respond ONLY with valid JSON in this exact format:
{
  "item": "product name",
  "description": "brief description",
  "estimatedPrice": { "min": 15000, "max": 25000 },
  "confidence": "high|medium|low",
  "hagglingTips": ["tip 1", "tip 2", "tip 3"]
}

Use Vietnamese Dong (VND) amounts as plain integers. No markdown, no explanation, just JSON.`
                    }
                ]
            }];
        } else {
            return res.status(400).json({ error: 'Provide either image or itemName+textOnly' });
        }

        const response = await client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            messages
        });

        const text = response.content[0].text.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON in response');

        const data = JSON.parse(jsonMatch[0]);
        return res.status(200).json(data);

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message || 'Analysis failed' });
    }
};
