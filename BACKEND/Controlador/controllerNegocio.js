const ModeloNegocios = require("../Modelo/NegociosEsquema");

/**
 * --- CREAR UN NUEVO NEGOCIO ---
 * 1.  Validación de entrada para asegurar que los campos requeridos se envíen.
 * 2.  Manejo específico de errores para business_id duplicado.
 */
exports.crearNegocio = async (req, res) => {
  try {
    const { business_id, name, state, postal_code, is_open } = req.body;

    if (!business_id || !name || !state || !postal_code || is_open === undefined) {
      return res.status(400).json({ error: "Los campos business_id, name, state, postal_code, y is_open son obligatorios." });
    }

    const nuevoNegocio = new ModeloNegocios(req.body);
    await nuevoNegocio.save();
    res.status(201).json(nuevoNegocio);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: `El business_id '${error.keyValue.business_id}' ya existe.` });
    }
    res.status(400).json({ error: error.message });
  }
};

/**
 * --- OBTENER TODOS LOS NEGOCIOS (CON PAGINACIÓN) ---
 * 1.  Implementación de paginación para manejar grandes volúmenes de datos y evitar errores de memoria.
 */
exports.obtenerNegocios = async (req, res) => {
  try {

    const pagina = parseInt(req.query.page, 10) || 1;
    const limite = parseInt(req.query.limit, 10) || 20;


    const skip = (pagina - 1) * limite;


    const totalNegocios = await ModeloNegocios.countDocuments();


    const lista = await ModeloNegocios.find().skip(skip).limit(limite);


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
 * --- OBTENER UN NEGOCIO POR SU ID ---

 * 1.  Manejo de error específico para IDs con formato inválido (CastError).
 */
exports.obtenerNegocioPorId = async (req, res) => {
  try {
    const item = await ModeloNegocios.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Negocio no encontrado" });
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
 * --- ACTUALIZAR UN NEGOCIO POR SU ID ---

 * 1.  Manejo de error específico para IDs con formato inválido.
 */
exports.actualizarNegocio = async (req, res) => {
  try {
    const actualizado = await ModeloNegocios.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
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
 * --- ELIMINAR UN NEGOCIO POR SU ID ---

 * 1.  Manejo de error específico para IDs con formato inválido.
 * 2.  Mensaje de éxito consistente.
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