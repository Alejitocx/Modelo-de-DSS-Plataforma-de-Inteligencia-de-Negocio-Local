const { Router } = require('express');
const { z } = require('zod');
const { getCol } = require('./mongo');
const { normalizeRange, buckets, label } = require('./time');

const r = Router();

r.post('/compare', async (req, res) => {
  const schema = z.object({
    businessIds: z.array(z.string()).min(2).max(5),
    from: z.string().optional(),
    to: z.string().optional(),
    interval: z.enum(['day', 'week', 'month']).default('month')
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { businessIds, from, to, interval } = parsed.data;
  const { start, end } = normalizeRange(from, to);
  const reviews = getCol('resenas'); 
  const addFields = {
    y: { $year: '$date' },
    m: { $month: '$date' },
    d: interval === 'day' ? { $dayOfMonth: '$date' } : undefined,
    w: interval === 'week' ? { $isoWeek: '$date' } : undefined
  };

  const avgRows = await reviews.aggregate([
    { $match: { business_id: { $in: businessIds }, date: { $gte: start, $lte: end } } },
    { $addFields: addFields },
    { $group: { _id: { b: '$business_id', y: '$y', m: '$m', d: '$d', w: '$w' }, v: { $avg: '$stars' } } },
    { $sort: { '_id.b': 1, '_id.y': 1, '_id.m': 1, '_id.w': 1, '_id.d': 1 } }
  ]).toArray();

  const cntRows = await reviews.aggregate([
    { $match: { business_id: { $in: businessIds }, date: { $gte: start, $lte: end } } },
    { $addFields: addFields },
    { $group: { _id: { b: '$business_id', y: '$y', m: '$m', d: '$d', w: '$w' }, n: { $sum: 1 } } },
    { $sort: { '_id.b': 1, '_id.y': 1, '_id.m': 1, '_id.w': 1, '_id.d': 1 } }
  ]).toArray();

  const distRows = await reviews.aggregate([
    { $match: { business_id: { $in: businessIds }, date: { $gte: start, $lte: end } } },
    { $group: { _id: { b: '$business_id', s: '$stars' }, n: { $sum: 1 } } },
    { $sort: { '_id.b': 1, '_id.s': 1 } }
  ]).toArray();

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
    return Object.entries(perBiz).map(([biz, m]) => ({ label: biz, data: labelsX.map(l => m[l] ?? 0) }));
  };

  const ratingOverTime = { labels: labelsX, datasets: toDatasets(avgRows.map(r => ({...r, v: r.v})), 'v') };
  const reviewsOverTime = { labels: labelsX, datasets: toDatasets(cntRows, 'n') };

  const stars = [1,2,3,4,5];
  const grouped = {};
  for (const r0 of distRows) {
    grouped[r0._id.b] ||= {};
    grouped[r0._id.b][r0._id.s] = r0.n;
  }
  const ratingDistribution = {
    labels: stars,
    datasets: Object.entries(grouped).map(([biz, m]) => ({ label: biz, data: stars.map(s => m[s] ?? 0) }))
  };

  res.json({ ratingOverTime, reviewsOverTime, ratingDistribution });
});

module.exports = r;
