// api/aria.js — Vercel serverless function
// Receives a query + context from the dashboard, calls OpenAI, returns response.
// Your OPENAI_API_KEY stays server-side — never exposed to the browser.

const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are Aria, a competitive ad intelligence assistant for Mosaic Wellness — a D2C health brand that owns BeBodywise (women's health), Man Matters (men's health), and Little Joys (children's nutrition).

You analyse Meta Ad Library data from 10 tracked competitor brands. You give specific, data-driven answers. Always cite brand names and numbers. Maximum 3 sentences. No bullet points. Sound like a sharp senior strategist, not a chatbot.

Competitor brands tracked:
- BeBodywise competitors: Wellbeing Nutrition, Wow Skin Science, mCaffeine, Pilgrim, Mamaearth
- Man Matters competitors: Boldfit, HealthKart  
- Little Joys competitors: Oziva, The Moms Co, Nykaa Health

Key facts:
- HealthKart leads by volume (55 ads, 14 performers), running mostly Offer/Discount carousel ads
- Mamaearth (48 ads) recently shifted from doctor-authority to UGC testimonials
- Wow Skin Science has the longest-running single creative at 52 days (video testimonial)
- Biggest creative gap: carousel ingredient education — zero competitors running this for BeBodywise
- Man Matters gap: community UGC video — completely absent from men's wellness competitive set
- Little Joys gap: pediatric nutrition education video — entirely uncontested`;

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, context } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'query is required' });
  }

  // Build a richer system prompt using live context passed from the dashboard
  const contextNote = context
    ? `\n\nLive dashboard data: ${context.totalAds} total ads tracked, ${context.performers} proven performers (30+ days), ${context.videoAds} video ads. Top brands by volume: ${context.topBrands?.join(', ')}.`
    : '';

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 280,
      temperature: 0.4,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + contextNote },
        { role: 'user', content: query }
      ]
    });

    const response = completion.choices[0].message.content;
    return res.status(200).json({ response });

  } catch (error) {
    console.error('OpenAI error:', error.message);
    // Return a graceful fallback so the UI never breaks
    return res.status(200).json({
      response: `Tracking ${context?.totalAds || 319} ads across 10 brands. HealthKart leads by volume with 55 ads, followed by Mamaearth (48) and Wow Skin Science (41). What specific brand or format would you like me to analyse?`
    });
  }
};
