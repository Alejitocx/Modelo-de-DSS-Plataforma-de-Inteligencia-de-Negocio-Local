const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.set('debug', true); 


const rutaCheckIn = require('./Rutas/rutaCheckIn');
const rutaNegocio = require("./Rutas/rutaNegocio.js");
const rutaReseña = require("./Rutas/rutaReseña.js");
const rutaTip = require("./Rutas/rutaTip.js");
const rutaUsuario = require("./Rutas/rutaUsuario");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/negocios", rutaNegocio);
app.use("/resenas", rutaReseña);
app.use("/tips", rutaTip);
app.use("/usuarios", rutaUsuario);
app.use("/checkin", rutaCheckIn);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI no está definido. Configura la variable de entorno en tu .env");
  process.exit(1);
}

console.log(`Intentando conectar a MongoDB -> ${process.env.MONGO_URI}`);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

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

const port = process.env.PORT || 4000; // 👈 ahora PORT con mayúsculas
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

