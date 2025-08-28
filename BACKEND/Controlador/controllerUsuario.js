const ModeloUsuario = require("../Modelo/UsuarioEsquema");

/**
 * --- CREAR UN NUEVO USUARIO ---
 * 1.  Encriptación de contraseña antes de guardar.
 * 2.  Manejo específico de errores para campos únicos (email, user_id).
 */
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, user_id } = req.body;

    if (!nombre || !email || !password || !user_id) {
      return res.status(400).json({ error: "Los campos nombre, email, password y user_id son obligatorios." });
    }

  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

 
    const nuevoUsuario = new ModeloUsuario({
      nombre, 
      email,
      password: hashedPassword,
      user_id
    });

    await nuevoUsuario.save();

    const usuarioCreado = nuevoUsuario.toObject();
    delete usuarioCreado.password;

    res.status(201).json(usuarioCreado);

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({ error: `El valor para el campo ${Object.keys(error.keyValue)[0]} ya existe.` });
    }
    res.status(400).json({ error: error.message });
  }
};

/**
 * --- OBTENER TODOS LOS USUARIOS (CON PAGINACIÓN) ---
 * Esta es la versión que ya corregimos.
 */
exports.obtenerUsuarios = async (req, res) => {
  try {
    const pagina = parseInt(req.query.page, 10) || 1;
    const limite = parseInt(req.query.limit, 10) || 20;
    const skip = (pagina - 1) * limite;

    const totalUsuarios = await ModeloUsuario.countDocuments();
    const lista = await ModeloUsuario.find()
      .select("-password") 
      .skip(skip)
      .limit(limite);

    res.json({
      totalUsuarios,
      paginaActual: pagina,
      totalPaginas: Math.ceil(totalUsuarios / limite),
      usuarios: lista,
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * --- OBTENER UN USUARIO POR SU ID ---
 * 1.  Manejo de error para IDs con formato inválido (CastError).
 * 2.  Exclusión de la contraseña en la respuesta.
 */
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await ModeloUsuario.findById(req.params.id).select("-password"); 

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {

    if (error.name === 'CastError') {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }
    res.status(500).json({ error: error.message });
  }
};

/**
 * --- ACTUALIZAR UN USUARIO POR SU ID ---
 * 1.  Si se envía una nueva contraseña, se encripta antes de actualizar.
 * 2.  Manejo de error para IDs con formato inválido.
 * 3.  Exclusión de la contraseña en la respuesta.
 */
exports.actualizarUsuario = async (req, res) => {
  try {
    const datosActualizar = req.body;

   
    if (datosActualizar.password) {
      const salt = await bcrypt.genSalt(10);
      datosActualizar.password = await bcrypt.hash(datosActualizar.password, salt);
    }

    const actualizado = await ModeloUsuario.findByIdAndUpdate(
      req.params.id,
      datosActualizar,
      { new: true, runValidators: true }
    ).select("-password"); 

    if (!actualizado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(actualizado);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }
    if (error.code === 11000) {
        return res.status(400).json({ error: `El valor para el campo ${Object.keys(error.keyValue)[0]} ya existe.` });
    }
    res.status(400).json({ error: error.message });
  }
};

/**
 * --- ELIMINAR UN USUARIO POR SU ID ---
 * 1.  Manejo de error para IDs con formato inválido.
 * 2.  Respuesta más clara y semántica.
 */
exports.eliminarUsuario = async (req, res) => {
  try {
    const eliminado = await ModeloUsuario.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ mensaje: "Usuario eliminado con éxito" });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }
    res.status(500).json({ error: error.message });
  }
};
