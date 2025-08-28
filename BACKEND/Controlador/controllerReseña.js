const modeloReseña = require("../Modelo/ReseñaEsquema");


/**
 * --- CREAR UNA NUEVA RESEÑA ---
 * 1.  Validación de los campos requeridos antes de intentar guardar.
 * 2.  Manejo específico de errores para campos únicos (como review_id).
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
 * --- OBTENER TODAS LAS RESEÑAS (CON PAGINACIÓN) ---
 * 1.  Implementación de paginación para evitar sobrecargar el servidor con demasiados datos.
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
 * --- OBTENER UNA RESEÑA POR SU ID ---
 * 1.  Manejo de errores para IDs con formato inválido (CastError).
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
 * --- ACTUALIZAR UNA RESEÑA POR SU ID ---
 * 1.  Manejo de errores para IDs con formato inválido.
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
 * --- ELIMINAR UNA RESEÑA POR SU ID ---
 * 1.  Manejo de errores para IDs con formato inválido.
 * 2.  Mensaje de éxito consistente.
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