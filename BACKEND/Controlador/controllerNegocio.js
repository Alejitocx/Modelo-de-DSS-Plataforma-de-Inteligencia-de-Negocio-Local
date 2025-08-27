const ModeloNegocios = require("../Modelo/NegociosEsquema");

exports.crearNegocio = async (req, res) => {
  try {
    const nuevoItem = new ModeloNegocios(req.body);
    await nuevoItem.save();
    res.status(201).send(nuevoItem);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.obtenerNegocios = async (req, res) => {
  try {
    const lista = await ModeloNegocios.find();
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerNegocioPorId = async (req, res) => {
  try {
    const item = await ModeloNegocios.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Negocio no encontrado" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarNegocio = async (req, res) => {
  try {
    const actualizado = await ModeloNegocios.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ error: "Negocio no encontrado" });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarNegocio = async (req, res) => {
  try {
    const eliminado = await ModeloNegocios.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Negocio no encontrado" });
    res.json({ mensaje: "Negocio eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
