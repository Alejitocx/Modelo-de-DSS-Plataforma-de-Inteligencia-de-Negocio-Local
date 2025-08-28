const ModeloCheckin = require('../Modelo/CheckInEsquema');

/**
 * --- CREAR UN NUEVO REGISTRO DE CHECK-IN ---
 * 1.  Validación de entrada para los campos requeridos.
 * 2.  Manejo de error específico para business_id duplicado.
 * 3.  Uso de res.json() para consistencia.
 */
exports.crearCheckIn = async (req, res) => {
  try {
    const { business_id, date } = req.body;


    if (!business_id || !date) {
      return res.status(400).json({ error: "Los campos business_id y date son obligatorios." });
    }

    const nuevoItem = new ModeloCheckin(req.body);
    await nuevoItem.save();
    res.status(201).json(nuevoItem);
  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({ error: `El business_id '${error.keyValue.business_id}' ya tiene un registro de check-in.` });
    }
    res.status(400).json({ error: error.message });
  }
};

/**
 * --- OBTENER TODOS LOS CHECK-INS (CON PAGINACIÓN) ---
 * 1.  Implementación de paginación para manejar grandes volúmenes de datos y evitar errores de memoria.
 */
exports.obtenerCheckIn = async (req, res) => {
  try {

    const pagina = parseInt(req.query.page, 10) || 1;
    const limite = parseInt(req.query.limit, 10) || 20;


    const skip = (pagina - 1) * limite;

 
    const totalCheckins = await ModeloCheckin.countDocuments();

  
    const lista = await ModeloCheckin.find()
      .skip(skip)
      .limit(limite);


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
 * --- OBTENER UN CHECK-IN POR SU ID ---
 * 1.  Manejo de error específico para IDs con formato inválido (CastError).
 */
exports.obtenerCheckinPorId = async (req, res) => {
  try {
    const item = await ModeloCheckin.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Check-in no encontrado" });
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
 * --- ACTUALIZAR UN CHECK-IN POR SU ID ---
 * 1.  Manejo de error específico para IDs con formato inválido.
 */
exports.actualizarCheckIn = async (req, res) => {
  try {
    const actualizado = await ModeloCheckin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) {
      return res.status(404).json({ error: "Check-in no encontrado" });
    }
    res.json(actualizado);
  } catch (error)
 {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }
    res.status(400).json({ error: error.message });
  }
};

/**
 * --- ELIMINAR UN CHECK-IN POR SU ID ---
 * 1.  Manejo de error específico para IDs con formato inválido.
 * 2.  Mensaje de éxito consistente.
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