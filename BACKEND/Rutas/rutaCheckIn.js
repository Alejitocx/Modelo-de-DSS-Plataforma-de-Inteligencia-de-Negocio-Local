const express = require("express");
const router = express.Router();
const controllerCheckIn = require('../Controlador/controllerCheckIn');

/**
 * @openapi
 * /checkin:
 *   post:
 *     tags:
 *       - CheckIn
 *     summary: Crear un nuevo check-in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *               - negocioId
 *             properties:
 *               usuarioId:
 *                 type: string
 *                 example: "64f0c0d4a1b2c3d4e5f6a7b8"
 *               negocioId:
 *                 type: string
 *                 example: "65a0b1c2d3e4f5g6h7i8j9k0"
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-27T10:00:00Z"
 *     responses:
 *       201:
 *         description: Check-in creado correctamente
 */
router.post("/", controllerCheckIn.crearCheckIn);

/**
 * @openapi
 * /checkin:
 *   get:
 *     tags:
 *       - CheckIn
 *     summary: Obtener todos los check-ins
 *     responses:
 *       200:
 *         description: Lista de check-ins
 */
router.get("/", controllerCheckIn.obtenerCheckIn);

/**
 * @openapi
 * /checkin/{id}:
 *   get:
 *     tags:
 *       - CheckIn
 *     summary: Obtener un check-in por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f0c0d4a1b2c3d4e5f6a7b8"
 *     responses:
 *       200:
 *         description: Check-in encontrado
 *       404:
 *         description: Check-in no encontrado
 */
router.get("/:id", controllerCheckIn.obtenerCheckinPorId);

/**
 * @openapi
 * /checkin/{id}:
 *   put:
 *     tags:
 *       - CheckIn
 *     summary: Actualizar un check-in
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f0c0d4a1b2c3d4e5f6a7b8"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-28T12:00:00Z"
 *     responses:
 *       200:
 *         description: Check-in actualizado correctamente
 *       404:
 *         description: Check-in no encontrado
 */
router.put("/:id", controllerCheckIn.actualizarCheckIn);

/**
 * @openapi
 * /checkin/{id}:
 *   delete:
 *     tags:
 *       - CheckIn
 *     summary: Eliminar un check-in por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Check-in eliminado correctamente
 *       404:
 *         description: Check-in no encontrado
 */
router.delete("/:id", controllerCheckIn.eliminarCheckIn);

module.exports = router;
