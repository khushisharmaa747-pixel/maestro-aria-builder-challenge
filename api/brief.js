// api/brief.js — Vercel serverless function
// Called by the weekly GitHub Action to regenerate the AI brief.
// Secured with a CRON_SECRET so only the Action can trigger it.

const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const AD_DATA = {
  totalAds: 319,
  performers: 83,
  brands: [
    { name: 'HealthKart',        ads: 55, performers: 14, topTheme: 'Offer/Discount',      topFormat: 'carousel', mosaic: 'ManMatters'  },
    { name: 'Mamaearth',         ads: 48, performers: 13, topTheme: 'UGC/Community',        topFormat: 'video',    mosaic: 'BeBodywise'  },
    { name: 'Wow Skin Science',  ads: 41, performers: 11, topTheme: 'Social Proof',         topFormat: 'video',    mosaic: 'BeBodywise'  },
    { name: 'Nykaa Health',      ads: 31, performers: 8,  topTheme: 'Offer/Discount',       topFormat: 'carousel', mosaic: 'LittleJoys'  },
    { name: 'Oziva',             ads: 34, performers: 9,  topTheme: 'Problem-Solution',     topFormat: 'video',    mosaic: 'LittleJoys'  },
    { name: 'Wellbeing Nutrition',ads:28, performers: 7,  topTheme: 'Education/Awareness',  topFormat: 'video',    mosaic: 'BeBodywise'  },
    { name: 'Pilgrim',           ads: 24, performers: 6,  topTheme: 'Education/Awareness',  topFormat: 'static',   mosaic: 'BeBodywise'  },
    { name: 'mCaffeine',         ads: 22, performers: 6,  topTheme: 'Lifestyle/Aspiration', topFormat: 'video',    mosaic: 'BeBodywise'  },
    { name: 'Boldfit',           ads: 19, performers: 5,  topTheme: 'Lifestyle/Aspiration', topFormat: 'static',   mosaic: 'ManMatters'  },
    { name: 'The Moms Co',       ads: 17, performers: 4,  topTheme: 'Social Proof',         topFormat: 'video',    mosaic: 'LittleJoys'  },
  ]
};

const SECTIONS = [
  'What Changed This Week',
  'Top Performing Formats',
  'Emerging Message Themes',
  'Creative Gaps and Opportunities',
  'One Thing to Act on Immediately'
];

async function generateSection(title, dataContext) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 200,
    temperature: 0.5,
    messages: [{
      role: 'user',
      content: `You are a senior D2C marketing strategist at Mosaic Wellness (brands: BeBodywise, Man Matters, Little Joys).
      
Write the "${title}" section of this week's competitive ad intelligence brief. Be specific — cite brand names and numbers. 3–4 sentences. No bullet points. Write like a smart strategist, not a bot.

Data:
${dataContext}`
    }]
  });
  return res.choices[0].message.content.trim();
}

module.exports = async function handler(req, res) {
  // Secure this endpoint
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const dataContext = JSON.stringify(AD_DATA, null, 2);

  try {
    const sections = [];
    for (const title of SECTIONS) {
      const body = await generateSection(title, dataContext);
      sections.push({ title, body });
      console.log(`✓ Generated: ${title}`);
    }

    const brief = {
      generatedAt: new Date().toISOString(),
      sections
    };

    return res.status(200).json({ success: true, brief });

  } catch (error) {
    console.error('Brief generation error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
