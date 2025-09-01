const { Router } = require('express');
const multer = require('multer');
const { z } = require('zod');
const { getCol } = require('./mongo');

const r = Router();
const upload = multer({ limits: { fileSize: 20 * 1024 * 1024 } });

r.post('/upload-json', upload.single('file'), async (req, res) => {
  try {
    const type = z.enum(['businesses', 'reviews', 'users']).parse(req.body.type);
    if (!req.file) return res.status(400).json({ error: 'file missing' });

    const json = JSON.parse(req.file.buffer.toString('utf8'));
    if (!Array.isArray(json)) return res.status(400).json({ error: 'expecting array of documents' });

    const col = getCol(type);
    const ops = json.map(d => ({ updateOne: { filter: { _id: d._id }, update: { $set: d }, upsert: true } }));
    const result = await col.bulkWrite(ops, { ordered: false });
    res.json({ ok: true, upserted: result.upsertedCount, modified: result.modifiedCount, matched: result.matchedCount });
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) });
  }
});

module.exports = r;
