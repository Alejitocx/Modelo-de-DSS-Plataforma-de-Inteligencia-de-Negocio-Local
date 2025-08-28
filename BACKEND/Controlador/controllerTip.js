const modeloTip = require("../Modelo/TipEsquema");

/**
 * --- CREAR UN NUEVO TIP ---
 * 1.  Validación de entrada para asegurar que los campos requeridos se envíen.
 */
exports.crearTip = async (req, res) => {
  try {
    const { user_id, business_id, text, date } = req.body;

    if (!user_id || !business_id || !text || !date) {
      return res.status(400).json({ error: "Los campos user_id, business_id, text y date son obligatorios." });
    }

    const nuevoItem = new modeloTip(req.body);
    await nuevoItem.save();
    res.status(201).json(nuevoItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * --- OBTENER TODOS LOS TIPS (CON PAGINACIÓN) ---
 * 1.  Implementación de paginación para manejar grandes volúmenes de datos y evitar errores de memoria.
 */
exports.obtenerTips = async (req, res) => {
  try {

    const pagina = parseInt(req.query.page, 10) || 1;
    const limite = parseInt(req.query.limit, 10) || 20; // 20 tips por página por defecto


    const skip = (pagina - 1) * limite;

    const totalTips = await modeloTip.countDocuments();


    const lista = await modeloTip.find()
      .skip(skip)
      .limit(limite);

    res.json({
      totalTips,
      paginaActual: pagina,
      totalPaginas: Math.ceil(totalTips / limite),
      tips: lista,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * --- OBTENER UN TIP POR SU ID ---
 * 1.  Manejo de error específico para IDs con formato inválido (CastError).
 */
exports.obtenerTipPorId = async (req, res) => {
  try {
    const item = await modeloTip.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Tip no encontrado" });
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
 * --- ACTUALIZAR UN TIP POR SU ID ---
 * 1.  Manejo de error específico para IDs con formato inválido.
 */
exports.actualizarTip = async (req, res) => {
  try {
    const actualizado = await modeloTip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } 
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
 * --- ELIMINAR UN TIP POR SU ID ---
 * 1.  Manejo de error específico para IDs con formato inválido.
 * 2.  Mensaje de éxito más consistente.
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