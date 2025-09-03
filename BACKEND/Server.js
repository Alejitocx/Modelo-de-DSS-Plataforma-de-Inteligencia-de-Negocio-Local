const express = require('express');
const cors = require('cors'); 
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set('debug', true); // Habilita el logging de consultas de MongoDB

// Importación de rutas de la API principal
const rutaCheckIn = require('./Rutas/rutaCheckIn');
const rutaNegocio = require("./Rutas/rutaNegocio.js");
const rutaResena = require("./Rutas/rutaReseña.js"); 
const rutaTip = require("./Rutas/rutaTip.js");
const rutaUsuario = require("./Rutas/rutaUsuario");

// Importación de configuración de Swagger/OpenAPI
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// Importación de módulos del Sistema de Soporte a Decisiones (DSS)
const dssMetrics = require('./Rutas/dss/metrics');        
const dssCompetitors = require('./Rutas/dss/competitors'); 
const dssAttributes = require('./Rutas/dss/attributes');   
const dssAdmin = require('./Rutas/dss/admin');             
const { dssSpec } = require('./Rutas/dss/openapi');        

// Inicialización de la aplicación Express
const app = express();

// Middlewares globales
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite el parsing de JSON en las solicitudes

// Montaje de rutas de la API principal
app.use("/negocios", rutaNegocio);
app.use("/resenas", rutaResena);
app.use("/tips", rutaTip);
app.use("/usuarios", rutaUsuario);
app.use("/checkin", rutaCheckIn);

// Montaje de rutas del Sistema de Soporte a Decisiones (DSS)
app.use('/api/v1/metrics', dssMetrics);
app.use('/api/v1/competitors', dssCompetitors);
app.use('/api/v1/attributes', dssAttributes);
app.use('/api/v1/admin', dssAdmin);

// Combinación de las especificaciones OpenAPI de la API principal y el DSS
const swaggerMerged = {
  ...swaggerSpec,
  paths: { ...(swaggerSpec.paths || {}), ...(dssSpec.paths || {}) }
};

// Configuración de la documentación API con Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerMerged));

// Validación de variable de entorno esencial
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI no está definido");
  process.exit(1); // Termina la aplicación si no hay cadena de conexión
}

console.log(`Intentando conectar a MongoDB -> ${process.env.MONGO_URI}`);

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Conectado a MongoDB");
    
    // Listar colecciones disponibles (para debugging)
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      console.log("Colecciones disponibles:", collections.map(c => c.name));
    } catch (e) {
      console.warn("No se pudieron listar colecciones:", e.message);
    }
  })
  .catch(err => console.error("❌ Error al conectar a MongoDB:", err));

// Manejo de rutas no encontradas (404)
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

// Inicialización del servidor
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Servidor escuchando en http://localhost:${port}`));
