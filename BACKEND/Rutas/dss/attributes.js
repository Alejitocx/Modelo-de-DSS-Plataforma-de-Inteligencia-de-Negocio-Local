const { Router } = require('express');
const { z } = require('zod');
const { getCol } = require('./mongo');

const r = Router();

r.get('/_check', (req,res)=>res.json({ok:true}));

r.post('/impact', async (req, res) => {
  try {
    const schema = z.object({
      category: z.string().optional(),
      geo: z.object({ city: z.string().optional(), state: z.string().optional() }).optional(),
      attributes: z.array(z.string()).min(1),
      limitIds: z.number().int().positive().max(5000).optional() // guardia opcional
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());
    const { category, geo, attributes, limitIds } = parsed.data;

    const negocios = getCol('negocios');
    const resenas  = getCol('resenas');

    // 1) Prefiltro por negocio usando índices
    const bizMatch = {
      ...(category ? { categories: category } : {}),
      ...(geo?.city ? { city: geo.city } : {}),
      ...(geo?.state ? { state: geo.state } : {})
    };
    const projId = { projection: { _id: 1 } };
    let ids = await negocios.find(bizMatch, projId).toArray();
    if (!ids.length) return res.json({ byAttribute: [], diff: [] });
    if (limitIds && ids.length > limitIds) ids = ids.slice(0, limitIds);
    const idList = ids.map(d => d._id);

    // 2) Proyección dinámica de atributos desde el negocio unido
    const projectAttrs = Object.fromEntries(
      attributes.map(k => [k.replaceAll('.', '_'), `$biz.${k}`])
    );

    // 3) Pipeline eficiente: match -> lookup -> unwind -> project
    const cursor = resenas.aggregate([
      { $match: { business_id: { $in: idList } } }, // usa índice { business_id:1 }
      {
        $lookup: {
          from: 'negocios',
          localField: 'business_id',
          foreignField: '_id',
          as: 'biz'
        }
      },
      { $unwind: '$biz' }, // ya está acotado al subconjunto
      { $project: { stars: 1, ...projectAttrs } }
    ], { allowDiskUse: true });

    const rows = await cursor.toArray();

    // 4) Reducción en memoria
    const result = [];
    for (const attr of attributes) {
      const key = attr.replaceAll('.', '_');
      const grp = new Map();
      for (const r0 of rows) {
        const v = r0[key];
        const kk = String(v);
        const acc = grp.get(kk) || { sum: 0, n: 0 };
        acc.sum += Number(r0.stars) || 0;
        acc.n += 1;
        grp.set(kk, acc);
      }
      for (const [val, { sum, n }] of grp.entries()) {
        result.push({
          key: attr,
          value: val === 'undefined' ? null : cast(val),
          avgStars: n ? +(sum / n).toFixed(3) : 0,
          count: n
        });
      }
    }

    const diff = [];
    if (attributes.length >= 2) {
      const [a, b] = attributes;
      const avg = (k) => {
        const xs = result.filter(r => r.key === k);
        const n = xs.reduce((s, r) => s + r.count, 0) || 1;
        const s = xs.reduce((s, r) => s + r.avgStars * r.count, 0);
        return s / n;
      };
      diff.push({ compare: [a, b], delta: +((avg(a) - avg(b)) || 0).toFixed(3) });
    }

    res.json({ byAttribute: result, diff });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

function cast(val) {
  if (val === 'true') return true;
  if (val === 'false') return false;
  const num = Number(val);
  return Number.isFinite(num) ? num : val;
}

module.exports = r;
