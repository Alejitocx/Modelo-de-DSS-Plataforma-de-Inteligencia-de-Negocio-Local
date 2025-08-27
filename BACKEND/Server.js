        const express = require('express');
        const mongoose = require ("mongoose")
        require("dotenv").config();



        const rutaCheckIn=require("/Rutas/rutaCheckIn");
        const rutaNegocio=require("/Rutas/rutaNegocio.js");
        const rutaReseña=require("/Rutas/rutaReseña.js");
        const rutaTip=requiere("/Rutas/rutaTip.js");
        const rutaUsuario=require("/Rutas/rutaUsuario");

        const app = express();
        app.use(express.json());

  
        app.use("/negocios", rutaNegocio);
        app.use("/reseñas", rutaReseña);
        app.use("/tips", rutaTip);
        app.use("/usuarios", rutaUsuario);
        app.use("/checkin", rutaCheckIn);

        mongoose.connect(process.env.MONGO_URI)
         .then(() => console.log("✅ Conectado a MongoDB"))
          .catch(err => console.error("❌ Error al conectar MongoDB:", err));

      
         const port = process.env.port || 4000 
        app.listen(port, () => {
          console.log(`Servidor escuchando en http://localhost:${port}`);
        });