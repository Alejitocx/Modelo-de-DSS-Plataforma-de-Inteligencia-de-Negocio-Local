const modeloTip = require("/Modelo/TipEsquema");


exports.crearTip = async (req, res) => {
  try {
    const nuevoItem = new modeloTip(req.body);
    await nuevoItem.save();
    res.status(201).json(nuevoItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerTips = async (req, res) => {
  try {
    const lista = await modeloTip.find();
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.obtenerTipPorId = async (req, res) => {
  try {
    const item = await modeloTip.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Tip no encontrado" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.actualizarTip = async (req, res) => {
  try {
    const actualizado = await modeloTip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ error: "Tip no encontrado" });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.eliminarTip = async (req, res) => {
  try {
    const eliminado = await modeloTip.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Tip no encontrado" });
    res.json({ mensaje: "Tip eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
