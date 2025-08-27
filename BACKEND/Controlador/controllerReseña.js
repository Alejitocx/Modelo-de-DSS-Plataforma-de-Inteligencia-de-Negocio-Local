const modeloReseña = require("../Modelo/ReseñaEsquema");

// Crear reseña
exports.crearReseña = async (req, res) => {
  try {
    const nuevoItem = new modeloReseña(req.body);
    await nuevoItem.save();
    res.status(201).send(nuevoItem);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Obtener todas las reseñas
exports.obtenerReseñas = async (req, res) => {
  try {
    const lista = await modeloReseña.find();
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener reseña por ID
exports.obtenerReseñaPorId = async (req, res) => {
  try {
    const item = await modeloReseña.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Reseña no encontrada" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar reseña
exports.actualizarReseña = async (req, res) => {
  try {
    const actualizado = await modeloReseña.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ error: "Reseña no encontrada" });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar reseña
exports.eliminarReseña = async (req, res) => {
  try {
    const eliminado = await modeloReseña.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Reseña no encontrada" });
    res.json({ mensaje: "Reseña eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
