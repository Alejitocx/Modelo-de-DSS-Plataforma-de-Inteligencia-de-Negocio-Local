// server.js
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

mongoose.set('debug', true);

const rutaCheckIn = require('./Rutas/rutaCheckIn');
const rutaNegocio = require("./Rutas/rutaNegocio.js");
const rutaResena = require("./Rutas/rutaReseña.js"); 
const rutaTip = require("./Rutas/rutaTip.js");
const rutaUsuario = require("./Rutas/rutaUsuario");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// === DSS: nuevos routers ===
const dssMetrics = require('./Rutas/dss/metrics');        // /api/v1/metrics
const dssCompetitors = require('./Rutas/dss/competitors'); // /api/v1/competitors
const dssAttributes = require('./Rutas/dss/attributes');   // /api/v1/attributes
const dssAdmin = require('./Rutas/dss/admin');             // /api/v1/admin
const { dssSpec } = require('./Rutas/dss/openapi');        // merge Swagger

const app = express();
app.use(cors());
app.use(express.json());

// Rutas existentes
app.use("/negocios", rutaNegocio);
app.use("/resenas", rutaResena);
app.use("/tips", rutaTip);
app.use("/usuarios", rutaUsuario);
app.use("/checkin", rutaCheckIn);

// Rutas DSS nuevas (no rompen lo existente)
app.use('/api/v1/metrics', dssMetrics);
app.use('/api/v1/competitors', dssCompetitors);
app.use('/api/v1/attributes', dssAttributes);
app.use('/api/v1/admin', dssAdmin);

// Swagger: mezcla tu spec con el de DSS
const swaggerMerged = {
  ...swaggerSpec,
  paths: { ...(swaggerSpec.paths || {}), ...(dssSpec.paths || {}) }
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerMerged));

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI no está definido");
  process.exit(1);
}

console.log(`Intentando conectar a MongoDB -> ${process.env.MONGO_URI}`);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Conectado a MongoDB");
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      console.log("Colecciones disponibles:", collections.map(c => c.name));
    } catch (e) {
      console.warn("No se pudieron listar colecciones:", e.message);
    }
  })
  
  .catch(err => console.error("❌ Error al conectar a MongoDB:", err));
  // 404 al final de server.js, antes del errorHandler
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Ruta no encontrada.",
    causa: `No existe ${req.method} ${req.originalUrl}`,
    comoResolver: [
      "Verifica el método HTTP",
      "Consulta /api-docs para ver rutas válidas"
    ]
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Servidor escuchando en http://localhost:${port}`));
