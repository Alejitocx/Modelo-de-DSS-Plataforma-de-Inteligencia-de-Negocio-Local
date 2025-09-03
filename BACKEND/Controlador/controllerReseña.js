const modeloReseña = require("../Modelo/ReseñaEsquema");

/**
 * Controlador para gestionar operaciones CRUD de reseñas
 * @module ControladorReseñas
 */

/**
 * Crea una nueva reseña en la base de datos
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Cuerpo de la solicitud con los datos de la reseña
 * @param {string} req.body.review_id - ID único de la reseña
 * @param {string} req.body.user_id - ID del usuario que crea la reseña
 * @param {string} req.body.business_id - ID del negocio evaluado
 * @param {number} req.body.stars - Calificación en estrellas (1-5)
 * @param {string} req.body.text - Texto de la reseña
 * @param {Date} req.body.date - Fecha de la reseña
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Respuesta JSON con la reseña creada o mensaje de error
 * @throws {400} Error de validación si faltan campos requeridos
 * @throws {400} Error si el review_id ya existe
 */
exports.crearReseña = async (req, res) => {
  try {
    const { review_id, user_id, business_id, stars, text, date } = req.body;

    if (!review_id || !user_id || !business_id || !stars || !text || !date) {
      return res.status(400).json({ error: "Todos los campos requeridos (review_id, user_id, business_id, stars, text, date) deben ser proporcionados." });
    }

    const nuevaReseña = new modeloReseña(req.body);
    await nuevaReseña.save();
    res.status(201).json(nuevaReseña);
  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({ error: `El review_id '${error.keyValue.review_id}' ya existe.` });
    }
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtiene todas las reseñas con soporte de paginación
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.query - Parámetros de consulta
 * @param {number} [req.query.page=1] - Número de página para paginación
 * @param {number} [req.query.limit=20] - Cantidad de resultados por página
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Respuesta JSON con objeto paginado que contiene:
 * - totalReseñas: Número total de reseñas
 * - paginaActual: Página actual mostrada
 * - totalPaginas: Número total de páginas disponibles
 * - reseñas: Array de reseñas de la página actual
 * @throws {500} Error interno del servidor
 */
exports.obtenerReseñas = async (req, res) => {
  try {
 
    const pagina = parseInt(req.query.page, 10) || 1;
    const limite = parseInt(req.query.limit, 10) || 20; 

    const skip = (pagina - 1) * limite;

    const totalReseñas = await modeloReseña.countDocuments();

    const lista = await modeloReseña.find()
      .skip(skip)
      .limit(limite);

    res.json({
      totalReseñas,
      paginaActual: pagina,
      totalPaginas: Math.ceil(totalReseñas / limite),
      reseñas: lista,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene una reseña específica por su ID
 * @param {Object} req - Objeto de solicitud de Express
 * @param {string} req.params.id - ID de la reseña a buscar
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Respuesta JSON con la reseña encontrada
 * @throws {404} Error si no se encuentra la reseña
 * @throws {400} Error si el ID tiene formato inválido
 * @throws {500} Error interno del servidor
 */
exports.obtenerReseñaPorId = async (req, res) => {
  try {
    const item = await modeloReseña.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Reseña no encontrada" });
    }
    res.json(item);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualiza una reseña existente por su ID
 * @param {Object} req - Objeto de solicitud de Express
 * @param {string} req.params.id - ID de la reseña a actualizar
 * @param {Object} req.body - Campos a actualizar
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Respuesta JSON con la reseña actualizada
 * @throws {404} Error si no se encuentra la reseña
 * @throws {400} Error si el ID tiene formato inválido
 * @throws {400} Error de validación en los datos de entrada
 */
exports.actualizarReseña = async (req, res) => {
  try {
    const actualizado = await modeloReseña.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) {
      return res.status(404).json({ error: "Reseña no encontrada" });
    }
    res.json(actualizado);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }
    res.status(400).json({ error: error.message });
  }
};

/**
 * Elimina una reseña existente por su ID
 * @param {Object} req - Objeto de solicitud de Express
 * @param {string} req.params.id - ID de la reseña a eliminar
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Object} Respuesta JSON con mensaje de confirmación
 * @throws {404} Error si no se encuentra la reseña
 * @throws {400} Error si el ID tiene formato inválido
 * @throws {500} Error interno del servidor
 */
exports.eliminarReseña = async (req, res) => {
  try {
    const eliminado = await modeloReseña.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: "Reseña no encontrada" });
    }
    res.json({ mensaje: "Reseña eliminada con éxito" });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }
    res.status(500).json({ error: error.message });
  }
};
