const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const rutaCheckIn = require('./Rutas/rutaCheckIn');
const rutaNegocio = require("./Rutas/rutaNegocio.js");
const rutaReseña = require("./Rutas/rutaReseña.js");
const rutaTip = require("./Rutas/rutaTip.js");
const rutaUsuario = require("./Rutas/rutaUsuario");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/negocios", rutaNegocio);
app.use("/reseñas", rutaReseña);
app.use("/tips", rutaTip);
app.use("/usuarios", rutaUsuario);
app.use("/checkin", rutaCheckIn);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error al conectar a MongoDB:", err));

const port = process.env.PORT || 4000; // 👈 ahora PORT con mayúsculas
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
