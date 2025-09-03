const { Router } = require('express');
const { z } = require('zod');
const { getCol } = require('./mongo'); 
const { normalizeRange, buckets, label } = require('./time'); 

const r = Router();

r.post('/compare', async (req, res) => {
  try {
    const schema = z.object({
      businessIds: z.array(z.string()).min(1).max(6),
      from: z.string().optional(),
      to: z.string().optional(),
      interval: z.enum(['day', 'week', 'month']).default('month')
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());

    const { businessIds, from, to, interval } = parsed.data;
    const { start, end } = normalizeRange(from, to);
    const reviews = getCol('resenas');
    const negocios = getCol('negocios');

    const businessesInfo = await negocios.find({ business_id: { $in: businessIds } }, { projection: { _id: 0, business_id: 1, name: 1 } }).toArray();
    const idToNameMap = businessesInfo.reduce((map, biz) => { map[biz.business_id] = biz.name; return map; }, {});

    const basePipeline = [
      { $match: { business_id: { $in: businessIds } } },
      { $addFields: { convertedDate: { $toDate: '$date' } } },
      { $match: { convertedDate: { $gte: start, $lte: end } } },
    ];
    
    const [avgRows, cntRows, distRows] = await Promise.all([
      reviews.aggregate([...basePipeline, { $group: { _id: { b: '$business_id', y: { $year: '$convertedDate' }, m: { $month: '$convertedDate' } }, v: { $avg: '$stars' } } }, { $sort: { '_id.b': 1, '_id.y': 1, '_id.m': 1 } }]).toArray(),
      reviews.aggregate([...basePipeline, { $group: { _id: { b: '$business_id', y: { $year: '$convertedDate' }, m: { $month: '$convertedDate' } }, n: { $sum: 1 } } }, { $sort: { '_id.b': 1, '_id.y': 1, '_id.m': 1 } }]).toArray(),
      reviews.aggregate([...basePipeline, { $group: { _id: { b: '$business_id', s: '$stars' }, n: { $sum: 1 } } }, { $sort: { '_id.b': 1, '_id.s': 1 } }]).toArray()
    ]);

    const pts = buckets({ start, end }, interval);
    const labelsX = pts.map(d => label(d, interval));
    const toDatasets = (rows, key) => {
      const perBiz = {};
      for (const r0 of rows) {
        const dt = new Date(r0._id.y, (r0._id.m || 1) - 1, r0._id.d || 1);
        const lb = label(dt, interval);
        perBiz[r0._id.b] ||= {};
        perBiz[r0._id.b][lb] = r0[key];
      }
      return Object.entries(perBiz).map(([bizId, m]) => ({ label: idToNameMap[bizId] || bizId, data: labelsX.map(l => m[l] ?? 0) }));
    };

    const ratingOverTime = { labels: labelsX, datasets: toDatasets(avgRows.map(r => ({ ...r, v: r.v })), 'v') };
    const reviewsOverTime = { labels: labelsX, datasets: toDatasets(cntRows, 'n') };

    const stars = [1, 2, 3, 4, 5];
    const grouped = {};
    for (const r0 of distRows) {
      grouped[r0._id.b] ||= {};
      grouped[r0._id.b][r0._id.s] = r0.n;
    }
    const ratingDistribution = {
      labels: stars.map(s => `${s} Estrella(s)`),
      datasets: Object.entries(grouped).map(([bizId, m]) => ({ label: idToNameMap[bizId] || bizId, data: stars.map(s => m[s] ?? 0) }))
    };

    res.json({ ratingOverTime, reviewsOverTime, ratingDistribution });

  } catch (error) {
    console.error("Error en el endpoint /compare:", error);
    res.status(500).json({ error: "Ocurrió un error interno en el servidor." });
  }
});

module.exports = r;