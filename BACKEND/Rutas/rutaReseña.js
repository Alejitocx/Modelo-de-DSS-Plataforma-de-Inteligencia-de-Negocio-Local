const express = require("express");
const router = express.Router();
const controllerReseña = require("../Controlador/controllerReseña");

router.post("/reseñas", controllerReseña.crearReseña);
router.get("/reseñas", controllerReseña.obtenerReseñas);
router.get("/reseñas:id", controllerReseña.obtenerReseñaPorId);
router.put("/reseñas:id", controllerReseña.actualizarReseña);
router.delete("/reseñas:id", controllerReseña.eliminarReseña);

module.exports = router;