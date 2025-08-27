const express = require("express");
const router = express.Router();
const controllerUsuario= require("/Controlador/controllerUsuario");

router.post("/usuarios", controllerUsuario.crearUsuario);
router.get("/usuarios", controllerUsuario.obtenerUsuarios);
router.get("/usuarios:id", controllerUsuario.obtenerUsuarioPorId);
router.put("/usuarios:id", controllerUsuario.actualizarUsuario);
router.delete("/usuarios:id", controllerUsuario.eliminarUsuario);

module.exports = router;