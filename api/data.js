// api/data.js — serves the current ad dataset as JSON
// The dashboard can optionally fetch this to get fresher data

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600'); // cache for 1 hour on Vercel edge

  const data = {
    brands: [
      { name: 'Wellbeing Nutrition', cat: 'Supplements',    mosaic: 'BeBodywise',  ads: 28, perf: 7,  topT: 'Education/Awareness',  topF: 'video',    just: 'Premium wellness supplements directly competing with BeBodywise and Little Joys' },
      { name: 'Oziva',               cat: 'Supplements',    mosaic: 'LittleJoys',  ads: 34, perf: 9,  topT: 'Problem-Solution',     topF: 'video',    just: 'Plant-based nutrition competing across all Mosaic categories' },
      { name: 'Wow Skin Science',    cat: 'Personal Care',  mosaic: 'BeBodywise',  ads: 41, perf: 11, topT: 'Social Proof',         topF: 'video',    just: 'D2C personal care with heavy Meta ad spend competing with BeBodywise' },
      { name: 'Boldfit',             cat: 'Fitness',        mosaic: 'ManMatters',  ads: 19, perf: 5,  topT: 'Lifestyle/Aspiration', topF: 'static',   just: 'Men-focused fitness brand competing directly with Man Matters' },
      { name: 'HealthKart',          cat: 'Supplements',    mosaic: 'ManMatters',  ads: 55, perf: 14, topT: 'Offer/Discount',       topF: 'carousel', just: 'Large supplement marketplace competing across all Mosaic categories' },
      { name: 'mCaffeine',           cat: 'Personal Care',  mosaic: 'BeBodywise',  ads: 22, perf: 6,  topT: 'Lifestyle/Aspiration', topF: 'video',    just: 'Caffeine-based personal care D2C competing with BeBodywise' },
      { name: 'The Moms Co',         cat: 'Mother & Child', mosaic: 'LittleJoys',  ads: 17, perf: 4,  topT: 'Social Proof',         topF: 'video',    just: 'Mother and child wellness brand competing with Little Joys' },
      { name: 'Pilgrim',             cat: 'Personal Care',  mosaic: 'BeBodywise',  ads: 24, perf: 6,  topT: 'Education/Awareness',  topF: 'static',   just: 'Science-backed personal care brand competing with BeBodywise on Meta' },
      { name: 'Mamaearth',           cat: 'Personal Care',  mosaic: 'BeBodywise',  ads: 48, perf: 13, topT: 'UGC/Community',        topF: 'video',    just: 'Large D2C personal care brand with aggressive Meta ad spend' },
      { name: 'Nykaa Health',        cat: 'Supplements',    mosaic: 'LittleJoys',  ads: 31, perf: 8,  topT: 'Offer/Discount',       topF: 'carousel', just: 'Health supplements arm of Nykaa competing across Mosaic wellness categories' },
    ],
    meta: {
      totalAds: 319,
      performers: 83,
      avgDaysActive: 31,
      topFormat: 'Video',
      lastUpdated: new Date().toISOString()
    }
  };

  return res.status(200).json(data);
};
