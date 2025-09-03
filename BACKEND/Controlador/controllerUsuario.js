const ModeloUsuario = require("../Modelo/UsuarioEsquema");

/**
 * Controlador para gestionar operaciones CRUD de usuarios
 * @module ControladorUsuario
 */

/**
 * Crea un nuevo usuario en la base de datos
 * @async
 * @function crearUsuario
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.nombre - Nombre del usuario
 * @param {string} req.body.email - Email del usuario (debe ser único)
 * @param {string} req.body.password - Contraseña en texto plano
 * @param {string} req.body.user_id - ID de usuario (debe ser único)
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Retorna respuesta HTTP con el usuario creado (sin password) o error
 * @throws {Error} Errores de validación o duplicidad de campos únicos
 */
exports.crearUsuario = async (req, res) => {
  try {
    // Validación de campos obligatorios
    const { nombre, email, password, user_id } = req.body;
    if (!nombre || !email || !password || !user_id) {
      return res.status(400).json({ error: "Los campos nombre, email, password y user_id son obligatorios." });
    }

    // Encriptación de contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creación y guardado del usuario
    const nuevoUsuario = new ModeloUsuario({
      nombre, 
      email,
      password: hashedPassword,
      user_id
    });

    await nuevoUsuario.save();

    // Eliminación de la password de la respuesta
    const usuarioCreado = nuevoUsuario.toObject();
    delete usuarioCreado.password;

    res.status(201).json(usuarioCreado);

  } catch (error) {
    // Manejo de errores de duplicidad
    if (error.code === 11000) {
      return res.status(400).json({ error: `El valor para el campo ${Object.keys(error.keyValue)[0]} ya existe.` });
    }
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtiene listado paginado de usuarios
 * @async
 * @function obtenerUsuarios
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.query - Parámetros de consulta
 * @param {string} req.query.page - Número de página (opcional)
 * @param {string} req.query.limit - Límite de resultados por página (opcional)
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Retorna respuesta HTTP con objeto paginado de usuarios (sin passwords)
 */
exports.obtenerUsuarios = async (req, res) => {
  try {
    // Configuración de paginación
    const pagina = parseInt(req.query.page, 10) || 1;
    const limite = parseInt(req.query.limit, 10) || 20;
    const skip = (pagina - 1) * limite;

    // Consulta a base de datos
    const totalUsuarios = await ModeloUsuario.countDocuments();
    const lista = await ModeloUsuario.find()
      .select("-password") // Excluye contraseñas
      .skip(skip)
      .limit(limite);

    // Respuesta paginada
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
 * Obtiene un usuario específico por su ID
 * @async
 * @function obtenerUsuarioPorId
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de ruta
 * @param {string} req.params.id - ID del usuario a buscar
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Retorna respuesta HTTP con el usuario (sin password) o error
 * @throws {Error} Errores de ID inválido o usuario no encontrado
 */
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await ModeloUsuario.findById(req.params.id).select("-password");

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    // Manejo de errores de ID inválido
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualiza un usuario existente por su ID
 * @async
 * @function actualizarUsuario
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de ruta
 * @param {string} req.params.id - ID del usuario a actualizar
 * @param {Object} req.body - Campos a actualizar
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Retorna respuesta HTTP con el usuario actualizado (sin password) o error
 * @throws {Error} Errores de validación, duplicidad o ID inválido
 */
exports.actualizarUsuario = async (req, res) => {
  try {
    const datosActualizar = req.body;

    // Encripta nueva contraseña si se proporciona
    if (datosActualizar.password) {
      const salt = await bcrypt.genSalt(10);
      datosActualizar.password = await bcrypt.hash(datosActualizar.password, salt);
    }

    const actualizado = await ModeloUsuario.findByIdAndUpdate(
      req.params.id,
      datosActualizar,
      { new: true, runValidators: true } // Retorna el documento actualizado y corre validaciones
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
 * Elimina un usuario por su ID
 * @async
 * @function eliminarUsuario
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.params - Parámetros de ruta
 * @param {string} req.params.id - ID del usuario a eliminar
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Retorna respuesta HTTP de confirmación o error
 * @throws {Error} Errores de ID inválido o usuario no encontrado
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
