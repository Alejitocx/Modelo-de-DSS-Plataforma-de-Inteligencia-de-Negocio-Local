const { Router } = require('express');
const { z } = require('zod');
const cors = require('cors'); 
const { getCol } = require('./mongo');

const r = Router();
r.post('/attributes-compare', async (req, res) => {
  try {
    const schema = z.object({
      businessIds: z.array(z.string()).min(1).max(6),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.flatten());

    const { businessIds } = parsed.data;
    const negocios = getCol('negocios');

    const results = await negocios.find(
      { business_id: { $in: businessIds } },
      // Solo traemos los campos que necesitamos para la tabla
      { projection: { _id: 0, business_id: 1, name: 1, attributes: 1 } }
    ).toArray();

    res.json(results);

  } catch (error)
  {
    console.error("Error en /attributes-compare:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = r;
