const express = require("express");
const router = express.Router();
const controllerNegocio = require("/Controlador/controllerNegocio");

router.post("/negocios", controllerNegocio.crearNegocio);
router.get("/negocios", controllerNegocio.obtenerNegocios);
router.get("/negocios:id", controllerNegocio.obtenerNegocioPorId);
router.put("/negocios:id", controllerNegocio.actualizarNegocio);
router.delete("/negocios:id", controllerNegocio.eliminarNegocio);

module.exports = router;
