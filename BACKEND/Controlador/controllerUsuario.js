const ModeloUsuario = require("../Modelo/UsuarioEsquema");


exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new ModeloUsuario(req.body);
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const lista = await ModeloUsuario.find();
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await ModeloUsuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const actualizado = await ModeloUsuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.eliminarUsuario = async (req, res) => {
  try {
    const eliminado = await ModeloUsuario.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ mensaje: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
