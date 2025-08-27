const express = require("express");
const router = express.Router();
const controllerCheckIn = require('../Controlador/controllerCheckIn');


router.post("/checkin", controllerCheckIn.crearCheckIn);
router.get("/checkin", controllerCheckIn.obtenerCheckIn);
router.get("/checkin/:id", controllerCheckIn.obtenerCheckinPorId);
router.put("/checkin/:id", controllerCheckIn.actualizarCheckIn);
router.delete("/checkin/:id", controllerCheckIn.eliminarCheckIn);

module.exports = router;
