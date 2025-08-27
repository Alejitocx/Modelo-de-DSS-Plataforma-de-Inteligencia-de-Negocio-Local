const express = require("express");
const router = express.Router();
const controllerReseña = require("../Controlador/controllerReseña");

/**
 * @openapi
 * /reseñas:
 *   post:
 *     tags:
 *       - Reseñas
 *     summary: Crear una nueva reseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *               - negocioId
 *               - comentario
 *               - calificacion
 *             properties:
 *               usuarioId:
 *                 type: string
 *                 example: "64f0c0d4a1b2c3d4e5f6a7b8"
 *               negocioId:
 *                 type: string
 *                 example: "65a0b1c2d3e4f5g6h7i8j9k0"
 *               comentario:
 *                 type: string
 *                 example: "Muy buen servicio y atención rápida."
 *               calificacion:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Reseña creada exitosamente
 */
router.post("/", controllerReseña.crearReseña);

/**
 * @openapi
 * /reseñas:
 *   get:
 *     tags:
 *       - Reseñas
 *     summary: Obtener todas las reseñas
 *     responses:
 *       200:
 *         description: Lista de reseñas
 */
router.get("/", controllerReseña.obtenerReseñas);

/**
 * @openapi
 * /reseñas/{id}:
 *   get:
 *     tags:
 *       - Reseñas
 *     summary: Obtener una reseña por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f0c0d4a1b2c3d4e5f6a7b8"
 *     responses:
 *       200:
 *         description: Reseña encontrada
 *       404:
 *         description: Reseña no encontrada
 */
router.get("/:id", controllerReseña.obtenerReseñaPorId);

/**
 * @openapi
 * /reseñas/{id}:
 *   put:
 *     tags:
 *       - Reseñas
 *     summary: Actualizar una reseña por ID
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
 *               comentario:
 *                 type: string
 *                 example: "El servicio fue bueno pero puede mejorar."
 *               calificacion:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       200:
 *         description: Reseña actualizada correctamente
 *       404:
 *         description: Reseña no encontrada
 */
router.put("/:id", controllerReseña.actualizarReseña);

/**
 * @openapi
 * /reseñas/{id}:
 *   delete:
 *     tags:
 *       - Reseñas
 *     summary: Eliminar una reseña por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reseña eliminada correctamente
 *       404:
 *         description: Reseña no encontrada
 */
router.delete("/:id", controllerReseña.eliminarReseña);

module.exports = router;
