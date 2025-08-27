const express = require("express");
const router = express.Router();
const controllerTip = require("../Controlador/controllerTip");

/**
 * @openapi
 * /tips:
 *   post:
 *     tags:
 *       - Tips
 *     summary: Crear un nuevo tip
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Consejo de productividad"
 *               descripcion:
 *                 type: string
 *                 example: "Divide tus tareas en bloques de 25 minutos."
 *     responses:
 *       201:
 *         description: Tip creado exitosamente
 */
router.post("/", controllerTip.crearTip);

/**
 * @openapi
 * /tips:
 *   get:
 *     tags:
 *       - Tips
 *     summary: Obtener todos los tips
 *     responses:
 *       200:
 *         description: Lista de tips
 */
router.get("/", controllerTip.obtenerTips);

/**
 * @openapi
 * /tips/{id}:
 *   get:
 *     tags:
 *       - Tips
 *     summary: Obtener un tip por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f0c0d4a1b2c3d4e5f6a7b8"
 *     responses:
 *       200:
 *         description: Tip encontrado
 *       404:
 *         description: Tip no encontrado
 */
router.get("/:id", controllerTip.obtenerTipPorId);

/**
 * @openapi
 * /tips/{id}:
 *   put:
 *     tags:
 *       - Tips
 *     summary: Actualizar un tip por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Consejo actualizado"
 *               descripcion:
 *                 type: string
 *                 example: "Ahora usa bloques de 50 minutos con pausas largas."
 *     responses:
 *       200:
 *         description: Tip actualizado correctamente
 *       404:
 *         description: Tip no encontrado
 */
router.put("/:id", controllerTip.actualizarTip);

/**
 * @openapi
 * /tips/{id}:
 *   delete:
 *     tags:
 *       - Tips
 *     summary: Eliminar un tip por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tip eliminado correctamente
 *       404:
 *         description: Tip no encontrado
 */
router.delete("/:id", controllerTip.eliminarTip);

module.exports = router;
