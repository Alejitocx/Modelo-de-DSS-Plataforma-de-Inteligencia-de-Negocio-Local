const express = require("express");
const router = express.Router();
const controllerUsuario = require("../Controlador/controllerUsuario");

/**
 * @openapi
 * /usuarios:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Crear un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 example: "juan@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */
router.post("/", controllerUsuario.crearUsuario);

/**
 * @openapi
 * /usuarios:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", controllerUsuario.obtenerUsuarios);

/**
 * @openapi
 * /usuarios/{id}:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener un usuario por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f0c0d4a1b2c3d4e5f6a7b8"
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", controllerUsuario.obtenerUsuarioPorId);

/**
 * @openapi
 * /usuarios/{id}:
 *   put:
 *     tags:
 *       - Usuarios
 *     summary: Actualizar un usuario por ID
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
 *                 example: "Juan Pérez Actualizado"
 *               email:
 *                 type: string
 *                 example: "juan.actualizado@example.com"
 *               password:
 *                 type: string
 *                 example: "nuevaPassword123"
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/:id", controllerUsuario.actualizarUsuario);

/**
 * @openapi
 * /usuarios/{id}:
 *   delete:
 *     tags:
 *       - Usuarios
 *     summary: Eliminar un usuario por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/:id", controllerUsuario.eliminarUsuario);

module.exports = router;
