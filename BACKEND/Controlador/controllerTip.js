const modeloTip = require("../Modelo/TipEsquema");

/**
 * Controlador para gestionar operaciones CRUD de Tips
 * @module ControladorTip
 */

/**
 * Crea un nuevo tip en la base de datos
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} req.body - Cuerpo de la solicitud con los datos del tip
 * @param {string} req.body.user_id - ID del usuario que crea el tip
 * @param {string} req.body.business_id - ID del negocio asociado al tip
 * @param {string} req.body.text - Contenido textual del tip
 * @param {Date} req.body.date - Fecha asociada al tip
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Object} Respuesta con el tip creado o mensaje de error
 */
exports.crearTip = async (req, res) => {
  try {
    // Validación de campos obligatorios
    const { user_id, business_id, text, date } = req.body;
    if (!user_id || !business_id || !text || !date) {
      return res.status(400).json({ error: "Los campos user_id, business_id, text y date son obligatorios." });
    }

    // Crear y guardar nuevo documento en MongoDB
    const nuevoItem = new modeloTip(req.body);
    await nuevoItem.save();
    
    // Devolver respuesta exitosa con código 201 (Created)
    res.status(201).json(nuevoItem);
  } catch (error) {
    // Manejo de errores de validación de Mongoose
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtiene todos los tips con soporte de paginación
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} req.query - Parámetros de consulta
 * @param {number} [req.query.page=1] - Número de página a consultar
 * @param {number} [req.query.limit=20] - Cantidad de resultados por página
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Object} Respuesta paginada con lista de tips y metadatos
 */
exports.obtenerTips = async (req, res) => {
  try {
    // Configuración de paginación (valores por defecto: página 1, 20 elementos)
    const pagina = parseInt(req.query.page, 10) || 1;
    const limite = parseInt(req.query.limit, 10) || 20;

    // Cálculo de elementos a saltar para la paginación
    const skip = (pagina - 1) * limite;

    // Conteo total de documentos en la colección
    const totalTips = await modeloTip.countDocuments();

    // Consulta a MongoDB con paginación
    const lista = await modeloTip.find()
      .skip(skip)
      .limit(limite);

    // Respuesta con metadatos de paginación
    res.json({
      totalTips,
      paginaActual: pagina,
      totalPaginas: Math.ceil(totalTips / limite),
      tips: lista,
    });

  } catch (error) {
    // Manejo de errores del servidor
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene un tip específico por su ID
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {string} req.params.id - ID del tip a buscar
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Object} Tip encontrado o mensaje de error
 */
exports.obtenerTipPorId = async (req, res) => {
  try {
    const item = await modeloTip.findById(req.params.id);
    
    // Verificar existencia del documento
    if (!item) {
      return res.status(404).json({ error: "Tip no encontrado" });
    }
    
    res.json(item);
  } catch (error) {
    // Manejo especial para IDs de MongoDB inválidos
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualiza un tip existente por su ID
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {string} req.params.id - ID del tip a actualizar
 * @param {Object} req.body - Campos a actualizar
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Object} Tip actualizado o mensaje de error
 */
exports.actualizarTip = async (req, res) => {
  try {
    const actualizado = await modeloTip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, // Devolver el documento actualizado
        runValidators: true // Ejecutar validaciones de Mongoose
      } 
    );
    
    if (!actualizado) {
      return res.status(404).json({ error: "Tip no encontrado" });
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
 * Elimina un tip existente por su ID
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {string} req.params.id - ID del tip a eliminar
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Object} Mensaje de confirmación o error
 */
exports.eliminarTip = async (req, res) => {
  try {
    const eliminado = await modeloTip.findByIdAndDelete(req.params.id);
    
    if (!eliminado) {
      return res.status(404).json({ error: "Tip no encontrado" });
    }
    
    res.json({ mensaje: "Tip eliminado con éxito" });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }
    res.status(500).json({ error: error.message });
  }
};
