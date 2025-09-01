const { Router } = require('express');
const { z } = require('zod');
const { getCol } = require('./mongo');
const { normalizeRange, buckets, label } = require('./time');

const r = Router();

r.post('/timeseries', async (req, res) => {
  const schema = z.object({
    collection: z.string(),
    dateField: z.string(),
    op: z.enum(['count', 'sum', 'avg', 'min', 'max']),
    valueField: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    interval: z.enum(['day', 'week', 'month']).default('month'),
    match: z.record(z.any()).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const p = parsed.data;

  const { start, end } = normalizeRange(p.from, p.to);
  const col = getCol(p.collection);

  const valueExpr =
    p.op === 'count' ? { $sum: 1 } :
    p.op === 'sum'   ? { $sum: `$${p.valueField}` } :
    p.op === 'avg'   ? { $avg: `$${p.valueField}` } :
    p.op === 'min'   ? { $min: `$${p.valueField}` } :
                       { $max: `$${p.valueField}` };

  const addFields = {
    y: { $year: `$${p.dateField}` },
    m: { $month: `$${p.dateField}` },
    d: p.interval === 'day' ? { $dayOfMonth: `$${p.dateField}` } : undefined,
    w: p.interval === 'week' ? { $isoWeek: `$${p.dateField}` } : undefined
  };

  const rows = await col.aggregate([
    { $match: { [p.dateField]: { $gte: start, $lte: end }, ...(p.match || {}) } },
    { $addFields: addFields },
    { $group: { _id: { y: '$y', m: '$m', d: '$d', w: '$w' }, value: valueExpr } },
    { $sort: { '_id.y': 1, '_id.m': 1, '_id.w': 1, '_id.d': 1 } }
  ]).toArray();

  const pts = buckets({ start, end }, p.interval);
  const labels = pts.map(d => label(d, p.interval));
  const map = new Map();
  for (const r0 of rows) {
    const dt = new Date(r0._id.y, (r0._id.m || 1) - 1, r0._id.d || 1);
    map.set(label(dt, p.interval), r0.value);
  }

  res.json({
    labels,
    datasets: [{ label: `${p.op}(${p.valueField || 'count'})`, data: labels.map(l => map.get(l) ?? 0) }]
  });
});

r.post('/top', async (req, res) => {
  const schema = z.object({
    collection: z.string(),
    groupBy: z.string(),
    op: z.enum(['count', 'sum', 'avg', 'min', 'max']),
    valueField: z.string().optional(),
    n: z.number().int().positive().max(100).optional(),
    match: z.record(z.any()).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const p = parsed.data;

  const col = getCol(p.collection);
  const n = p.n || 10;

  const valueExpr =
    p.op === 'count' ? { $sum: 1 } :
    p.op === 'sum'   ? { $sum: `$${p.valueField}` } :
    p.op === 'avg'   ? { $avg: `$${p.valueField}` } :
    p.op === 'min'   ? { $min: `$${p.valueField}` } :
                       { $max: `$${p.valueField}` };

  const rows = await col.aggregate([
    { $match: p.match || {} },
    { $group: { _id: `$${p.groupBy}`, value: valueExpr } },
    { $sort: { value: -1 } },
    { $limit: n }
  ]).toArray();

  res.json({
    labels: rows.map(r => String(r._id ?? 'N/A')),
    datasets: [{ label: `${p.op}(${p.valueField || 'count'})`, data: rows.map(r => r.value) }]
  });
});

r.post('/kpi', async (req, res) => {
  const schema = z.object({
    collection: z.string(),
    op: z.enum(['count', 'sum', 'avg', 'min', 'max']),
    valueField: z.string().optional(),
    match: z.record(z.any()).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const p = parsed.data;

  const col = getCol(p.collection);
  const valueExpr =
    p.op === 'count' ? { $sum: 1 } :
    p.op === 'sum'   ? { $sum: `$${p.valueField}` } :
    p.op === 'avg'   ? { $avg: `$${p.valueField}` } :
    p.op === 'min'   ? { $min: `$${p.valueField}` } :
                       { $max: `$${p.valueField}` };

  const [row] = await col.aggregate([
    { $match: p.match || {} },
    { $group: { _id: null, value: valueExpr } }
  ]).toArray();

  res.json({ value: row?.value ?? 0 });
});

module.exports = r;
