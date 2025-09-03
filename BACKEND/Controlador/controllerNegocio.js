const ModeloNegocios = require("../Modelo/NegociosEsquema");

/**
 * Controlador para gestionar las operaciones CRUD de negocios
 * @module ControladorNegocios
 */

/**
 * Crea un nuevo negocio en la base de datos
 * @async
 * @function crearNegocio
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Cuerpo de la solicitud con los datos del negocio
 * @param {string} req.body.business_id - ID único del negocio (requerido)
 * @param {string} req.body.name - Nombre del negocio (requerido)
 * @param {string} req.body.state - Estado donde se ubica el negocio (requerido)
 * @param {string} req.body.postal_code - Código postal del negocio (requerido)
 * @param {boolean} req.body.is_open - Estado de apertura del negocio (requerido)
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<Object>} Respuesta JSON con el negocio creado o error
 * @throws {400} Error de validación si faltan campos obligatorios
 * @throws {400} Error si el business_id ya existe
 */
exports.crearNegocio = async (req, res) => {
  try {
    // Validación de campos obligatorios
    const { business_id, name, state, postal_code, is_open } = req.body;
    if (!business_id || !name || !state || !postal_code || is_open === undefined) {
      return res.status(400).json({ error: "Los campos business_id, name, state, postal_code, y is_open son obligatorios." });
    }

    // Crear y guardar nuevo negocio
    const nuevoNegocio = new ModeloNegocios(req.body);
    await nuevoNegocio.save();
    res.status(201).json(nuevoNegocio);
  } catch (error) {
    // Manejo de errores específicos
    if (error.code === 11000) {
      return res.status(400).json({ error: `El business_id '${error.keyValue.business_id}' ya existe.` });
    }
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtiene todos los negocios con paginación
 * @async
 * @function obtenerNegocios
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.query - Parámetros de consulta
 * @param {number} [req.query.page=1] - Número de página para paginación
 * @param {number} [req.query.limit=20] - Cantidad de resultados por página
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<Object>} Respuesta JSON con objetos de negocio y metadatos de paginación
 * @throws {500} Error interno del servidor
 */
exports.obtenerNegocios = async (req, res) => {
  try {
    // Configuración de paginación
    const pagina = parseInt(req.query.page, 10) || 1;
    const limite = parseInt(req.query.limit, 10) || 20;
    const skip = (pagina - 1) * limite;

    // Consulta a la base de datos
    const totalNegocios = await ModeloNegocios.countDocuments();
    const lista = await ModeloNegocios.find().skip(skip).limit(limite);

    // Respuesta estructurada con metadatos
    res.json({
      totalNegocios,
      paginaActual: pagina,
      totalPaginas: Math.ceil(totalNegocios / limite),
      negocios: lista,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene un negocio específico por su ID
 * @async
 * @function obtenerNegocioPorId
 * @param {Object} req - Objeto de solicitud de Express
 * @param {string} req.params.id - ID de MongoDB del negocio
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<Object>} Respuesta JSON con el negocio encontrado
 * @throws {404} Error si no se encuentra el negocio
 * @throws {400} Error si el ID tiene formato inválido
 * @throws {500} Error interno del servidor
 */
exports.obtenerNegocioPorId = async (req, res) => {
  try {
    const item = await ModeloNegocios.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Negocio no encontrado" });
    }
    res.json(item);
  } catch (error) {
    // Manejo específico de error de casteo de ID
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualiza un negocio existente por su ID
 * @async
 * @function actualizarNegocio
 * @param {Object} req - Objeto de solicitud de Express
 * @param {string} req.params.id - ID de MongoDB del negocio a actualizar
 * @param {Object} req.body - Campos a actualizar
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<Object>} Respuesta JSON con el negocio actualizado
 * @throws {404} Error si no se encuentra el negocio
 * @throws {400} Error si el ID tiene formato inválido
 * @throws {400} Error de validación en los datos de entrada
 */
exports.actualizarNegocio = async (req, res) => {
  try {
    const actualizado = await ModeloNegocios.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Opciones: devolver documento actualizado y validar
    );
    if (!actualizado) {
      return res.status(404).json({ error: "Negocio no encontrado" });
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
 * Elimina un negocio existente por su ID
 * @async
 * @function eliminarNegocio
 * @param {Object} req - Objeto de solicitud de Express
 * @param {string} req.params.id - ID de MongoDB del negocio a eliminar
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<Object>} Respuesta JSON de confirmación
 * @throws {404} Error si no se encuentra el negocio
 * @throws {400} Error si el ID tiene formato inválido
 * @throws {500} Error interno del servidor
 */
exports.eliminarNegocio = async (req, res) => {
  try {
    const eliminado = await ModeloNegocios.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: "Negocio no encontrado" });
    }
    res.json({ mensaje: "Negocio eliminado con éxito" });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }
    res.status(500).json({ error: error.message });
  }
};
