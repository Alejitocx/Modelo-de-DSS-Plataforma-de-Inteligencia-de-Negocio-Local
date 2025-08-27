
const ModeloCheckin = require('../Modelo/CheckInEsquema');

exports.crearCheckIn = async (req, res) => {
  try {
    const nuevoItem = new ModeloCheckin(req.body);
    await nuevoItem.save();
    res.status(201).send(nuevoItem);
  } catch (error) {
    res.status(400).send(error);
  }
};


exports.obtenerCheckIn = async (req, res) => {
  try {
    const lista = await ModeloCheckin.find();
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.obtenerCheckinPorId = async (req, res) => {
  try {
    const item = await ModeloCheckin.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Checkin no encontrado" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarCheckIn = async (req, res) => {
  try {
    const actualizado = await ModeloCheckin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ error: "Checkin no encontrado" });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarCheckIn = async (req, res) => {
  try {
    const eliminado = await ModeloCheckin.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Checkin no encontrado" });
    res.json({ mensaje: "Checkin eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
