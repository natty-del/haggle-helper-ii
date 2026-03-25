/**
 * /api/analyze.js
 * 
 * Vercel Serverless Function
 * Handles two request types:
 * 1. Image-based scan with price estimation
 * 2. Text-only item price estimation (for shopping list)
 * 
 * Environment variable required: ANTHROPIC_API_KEY
 */

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { image, itemName, location, textOnly } = req.body;

        // Validate request
        if (!image && !itemName) {
            return res.status(400).json({ error: 'Image or itemName required' });
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            console.error('ANTHROPIC_API_KEY not set');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // HANDLE TEXT-ONLY REQUESTS (Shopping List)
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        if (textOnly && itemName) {
            return await handleTextOnlyRequest(apiKey, itemName, location, res);
        }

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // HANDLE IMAGE REQUESTS (Main Scan)
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        if (!image) {
            return res.status(400).json({ error: 'Image data required' });
        }

        return await handleImageRequest(apiKey, image, location, res);

    } catch (error) {
        console.error('Unhandled error:', error);
        return res.status(500).json({ 
            error: 'Analysis failed',
            details: error.message 
        });
    }
}

/**
 * Handle image-based price analysis
 */
async function handleImageRequest(apiKey, base64Image, location, res) {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image',
                                source: {
                                    type: 'base64',
                                    media_type: 'image/jpeg',
                                    data: base64Image
                                }
                            },
                            {
                                type: 'text',
                                text: buildImageAnalysisPrompt(location)
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Claude API error:', error);
            throw new Error(`Claude API error: ${error.error?.message || 'Unknown error'}`);
        }

        const result = await response.json();
        const analysisText = result.content?.[0]?.text || '';

        // Parse Claude's JSON response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('Could not parse Claude response:', analysisText);
            throw new Error('Invalid response format from Claude');
        }

        const analysis = JSON.parse(jsonMatch[0]);

        // Return formatted response
        return res.status(200).json({
            item: analysis.item || 'Unknown Item',
            description: analysis.description || '',
            estimatedPrice: {
                min: analysis.priceRange?.min || 0,
                max: analysis.priceRange?.max || 0,
                currency: 'VND'
            },
            confidence: analysis.confidence || 'medium',
            hagglingTips: analysis.hagglingTips || [],
            context: analysis.context || '',
            localInsights: analysis.localInsights || ''
        });

    } catch (error) {
        console.error('Image analysis error:', error);
        return res.status(500).json({ 
            error: 'Could not analyze image',
            details: error.message
        });
    }
}

/**
 * Handle text-only price estimation (for shopping list)
 */
async function handleTextOnlyRequest(apiKey, itemName, location, res) {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 256,
                messages: [
                    {
                        role: 'user',
                        content: buildTextOnlyPrompt(itemName, location)
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Claude API error:', error);
            throw new Error(`Claude API error: ${error.error?.message || 'Unknown error'}`);
        }

        const result = await response.json();
        const analysisText = result.content?.[0]?.text || '';

        // Parse Claude's JSON response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('Could not parse Claude response:', analysisText);
            throw new Error('Invalid response format from Claude');
        }

        const analysis = JSON.parse(jsonMatch[0]);

        // Return simplified response
        return res.status(200).json({
            item: itemName,
            priceRange: {
                min: analysis.priceRange?.min || 0,
                max: analysis.priceRange?.max || 0,
                currency: 'VND'
            }
        });

    } catch (error) {
        console.error('Text-only analysis error:', error);
        return res.status(500).json({ 
            error: 'Could not estimate price',
            details: error.message
        });
    }
}

/**
 * Build prompt for image analysis
 */
function buildImageAnalysisPrompt(location) {
    return `You are an expert on Vietnamese consumer prices and market conditions.

Analyze this image of a price tag or product label. If it shows a price, use that actual price as context.

Extract and provide:
1. Item name (specific)
2. Brief description (what you see)
3. Realistic price range in VND for LOCAL Vietnamese markets in ${location || 'Vietnam'}
   - DO NOT assume tourist prices
   - Consider if this is a market, supermarket, or vendor stall
   - Provide min and max prices based on what locals would pay
4. Confidence level (high, medium, low)
5. 3-4 haggling tips specific to this item type and location
6. Context about where this price level is normal
7. Local insights (e.g., "Bananas in season - prices should be low")

Return ONLY valid JSON (no markdown, no code blocks):
{
  "item": "item name",
  "description": "what you see",
  "priceRange": {
    "min": 15000,
    "max": 25000
  },
  "confidence": "high",
  "hagglingTips": ["tip 1", "tip 2", "tip 3"],
  "context": "local market context",
  "localInsights": "seasonal/supply info"
}`;
}

/**
 * Build prompt for text-only price estimation
 */
function buildTextOnlyPrompt(itemName, location) {
    return `You are an expert on Vietnamese consumer prices.

Estimate a realistic price range in VND for "${itemName}" in a typical Vietnamese market or supermarket in ${location || 'Vietnam'}.

Consider:
- LOCAL prices (not tourist markup)
- What everyday Vietnamese people pay
- Seasonal variations if applicable

Return ONLY valid JSON (no markdown, no code blocks):
{
  "item": "${itemName}",
  "priceRange": {
    "min": 10000,
    "max": 30000
  }
}`;
}
