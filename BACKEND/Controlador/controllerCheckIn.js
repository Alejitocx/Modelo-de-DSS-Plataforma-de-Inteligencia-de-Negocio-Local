const ModeloCheckin = require('../Modelo/CheckInEsquema');

/**
 * Controlador para gestionar operaciones CRUD de check-ins
 * @module Controladores/CheckIn
 */

/**
 * Crea un nuevo registro de check-in en la base de datos
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.business_id - ID del negocio (obligatorio)
 * @param {Date} req.body.date - Fecha del check-in (obligatorio)
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Object} Respuesta JSON con el nuevo check-in creado o error
 */
exports.crearCheckIn = async (req, res) => {
  try {
    // Validación de campos obligatorios
    const { business_id, date } = req.body;
    if (!business_id || !date) {
      return res.status(400).json({ error: "Los campos business_id y date son obligatorios." });
    }

    // Crear y guardar nuevo documento
    const nuevoItem = new ModeloCheckin(req.body);
    await nuevoItem.save();
    
    // Devolver respuesta exitosa
    res.status(201).json(nuevoItem);
  } catch (error) {
    // Manejo específico de error de duplicados
    if (error.code === 11000) {
      return res.status(400).json({ error: `El business_id '${error.keyValue.business_id}' ya tiene un registro de check-in.` });
    }
    // Manejo de errores generales
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtiene todos los registros de check-ins con paginación
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} req.query - Parámetros de consulta
 * @param {number} [req.query.page=1] - Número de página para paginación
 * @param {number} [req.query.limit=20] - Límite de documentos por página
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Object} Respuesta JSON con objeto paginado de check-ins
 */
exports.obtenerCheckIn = async (req, res) => {
  try {
    // Configuración de paginación
    const pagina = parseInt(req.query.page, 10) || 1;
    const limite = parseInt(req.query.limit, 10) || 20;
    const skip = (pagina - 1) * limite;

    // Obtener total de documentos y documentos paginados
    const totalCheckins = await ModeloCheckin.countDocuments();
    const lista = await ModeloCheckin.find()
      .skip(skip)
      .limit(limite);

    // Estructura de respuesta paginada
    res.json({
      totalCheckins,
      paginaActual: pagina,
      totalPaginas: Math.ceil(totalCheckins / limite),
      checkins: lista,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene un check-in específico por su ID
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {string} req.params.id - ID del check-in a buscar
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Object} Respuesta JSON con el check-in encontrado o error
 */
exports.obtenerCheckinPorId = async (req, res) => {
  try {
    const item = await ModeloCheckin.findById(req.params.id);
    
    // Manejo de documento no encontrado
    if (!item) {
      return res.status(404).json({ error: "Check-in no encontrado" });
    }
    
    res.json(item);
  } catch (error) {
    // Manejo específico de ID inválido
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualiza un check-in existente por su ID
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {string} req.params.id - ID del check-in a actualizar
 * @param {Object} req.body - Campos a actualizar
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Object} Respuesta JSON con el check-in actualizado o error
 */
exports.actualizarCheckIn = async (req, res) => {
  try {
    const actualizado = await ModeloCheckin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,        // Devolver el documento actualizado
        runValidators: true // Ejecutar validaciones del esquema
      }
    );
    
    if (!actualizado) {
      return res.status(404).json({ error: "Check-in no encontrado" });
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
 * Elimina un check-in existente por su ID
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {string} req.params.id - ID del check-in a eliminar
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Object} Respuesta JSON de confirmación o error
 */
exports.eliminarCheckIn = async (req, res) => {
  try {
    const eliminado = await ModeloCheckin.findByIdAndDelete(req.params.id);
    
    if (!eliminado) {
      return res.status(404).json({ error: "Check-in no encontrado" });
    }
    
    res.json({ mensaje: "Check-in eliminado con éxito" });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }
    res.status(500).json({ error: error.message });
  }
};
