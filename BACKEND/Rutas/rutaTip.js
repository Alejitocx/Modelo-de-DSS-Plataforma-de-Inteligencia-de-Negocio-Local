const express = require("express");
const router = express.Router();
const controllerTip = require("/Controlador/controllerTip");

router.post("/tips", controllerTip.crearTip);
router.get("/tips", controllerTip.obtenerTips);
router.get("/tips:id", controllerTip.obtenerTipPorId);
router.put("/tips:id", controllerTip.actualizarTip);
router.delete("/tips:id", controllerTip.eliminarTip);

module.exports = router;