const express = require("express");
const router = express.Router();
const controllerNegocio = require("../Controlador/controllerNegocio");

/**
 * @openapi
 * /negocios:
 *   post:
 *     tags:
 *       - Negocios
 *     summary: Crear un nuevo negocio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - direccion
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Restaurante La Esquina"
 *               direccion:
 *                 type: string
 *                 example: "Calle 123 #45-67"
 *               telefono:
 *                 type: string
 *                 example: "3201234567"
 *     responses:
 *       201:
 *         description: Negocio creado exitosamente
 */
router.post("/", controllerNegocio.crearNegocio);

/**
 * @openapi
 * /negocios:
 *   get:
 *     tags:
 *       - Negocios
 *     summary: Obtener todos los negocios
 *     responses:
 *       200:
 *         description: Lista de negocios
 */
router.get("/", controllerNegocio.obtenerNegocios);

/**
 * @openapi
 * /negocios/{id}:
 *   get:
 *     tags:
 *       - Negocios
 *     summary: Obtener un negocio por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f0c0d4a1b2c3d4e5f6a7b8"
 *     responses:
 *       200:
 *         description: Negocio encontrado
 *       404:
 *         description: Negocio no encontrado
 */
router.get("/:id", controllerNegocio.obtenerNegocioPorId);

/**
 * @openapi
 * /negocios/{id}:
 *   put:
 *     tags:
 *       - Negocios
 *     summary: Actualizar un negocio
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
 *               nombre:
 *                 type: string
 *                 example: "Nuevo Nombre del Negocio"
 *               direccion:
 *                 type: string
 *                 example: "Nueva dirección 456"
 *               telefono:
 *                 type: string
 *                 example: "3107654321"
 *     responses:
 *       200:
 *         description: Negocio actualizado correctamente
 *       404:
 *         description: Negocio no encontrado
 */
router.put("/:id", controllerNegocio.actualizarNegocio);

/**
 * @openapi
 * /negocios/{id}:
 *   delete:
 *     tags:
 *       - Negocios
 *     summary: Eliminar un negocio por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Negocio eliminado correctamente
 *       404:
 *         description: Negocio no encontrado
 */
router.delete("/:id", controllerNegocio.eliminarNegocio);

module.exports = router;
