const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Esquema para almacenar información de usuarios
 * Combina campos para nuevos usuarios (sistema de autenticación) con campos existentes de la colección Yelp
 * @typedef {Object} SchemaUsuario
 * @property {string} nombre - Nombre del usuario (requerido, alias: 'name')
 * @property {string} email - Email del usuario (único, no requerido para compatibilidad)
 * @property {string} password - Contraseña del usuario (no requerido para compatibilidad)
 * @property {string} user_id - ID único del usuario en el sistema Yelp (requerido, único)
 * @property {number} review_count - Cantidad de reseñas realizadas (default: 0)
 * @property {string} yelping_since - Fecha de registro en Yelp
 * @property {number} useful - Votos "útil" recibidos (default: 0)
 * @property {number} funny - Votos "divertido" recibidos (default: 0)
 * @property {number} cool - Votos "genial" recibidos (default: 0)
 * @property {string} elite - Años en que el usuario fue considerado "élite"
 * @property {string} friends - Lista de amigos (almacenada como cadena)
 * @property {number} fans - Cantidad de seguidores (default: 0)
 * @property {number} average_stars - Calificación promedio dada (default: 0)
 * @property {number} compliment_hot - Elogios "hot" recibidos (default: 0)
 * @property {number} compliment_more - Elogios "more" recibidos (default: 0)
 * @property {number} compliment_profile - Elogios al perfil recibidos (default: 0)
 * @property {number} compliment_cute - Elogios "cute" recibidos (default: 0)
 * @property {number} compliment_list - Elogios a listas recibidos (default: 0)
 * @property {number} compliment_note - Elogios a notas recibidos (default: 0)
 * @property {number} compliment_plain - Elogios "plain" recibidos (default: 0)
 * @property {number} compliment_cool - Elogios "cool" recibidos (default: 0)
 * @property {number} compliment_funny - Elogios "funny" recibidos (default: 0)
 * @property {number} compliment_writer - Elogios como escritor recibidos (default: 0)
 * @property {number} compliment_photos - Elogios a fotos recibidos (default: 0)
 */
const schemaUsuario = new mongoose.Schema({
  /**
   * Nombre del usuario
   * - Alias: 'name' (para compatibilidad con sistemas externos)
   */
  nombre: { 
    type: String, 
    required: true,
    alias: 'name' 
  },
  
  /**
   * Email del usuario
   * - No requerido para mantener compatibilidad con datos existentes
   * - Único pero permite valores nulos (sparse: true)
   */
  email: { 
    type: String, 
    required: false,
    unique: true,
    sparse: true
  },
  
  /**
   * Contraseña del usuario
   * - No requerida para mantener compatibilidad con datos existentes
   */
  password: { 
    type: String, 
    required: false
  },

  // --- Campos existentes de la colección Yelp ---

  /**
   * ID único del usuario en el sistema Yelp
   */
  user_id: { type: String, required: true, unique: true },
  
  /**
   * Cantidad de reseñas realizadas por el usuario
   */
  review_count: { type: Number, default: 0 },
  
  /**
   * Fecha de registro del usuario en Yelp
   */
  yelping_since: { type: String }, 
  
  /**
   * Cantidad de votos "útil" recibidos
   */
  useful: { type: Number, default: 0 },
  
  /**
   * Cantidad de votos "divertido" recibidos
   */
  funny: { type: Number, default: 0 },
  
  /**
   * Cantidad de votos "genial" recibidos
   */
  cool: { type: Number, default: 0 },
  
  /**
   * Años en que el usuario fue considerado "élite" en Yelp
   */
  elite: { type: String }, 
  
  /**
   * Lista de amigos del usuario
   * - Almacenada como cadena de texto
   */
  friends: { type: String }, 
  
  /**
   * Cantidad de seguidores del usuario
   */
  fans: { type: Number, default: 0 },
  
  /**
   * Calificación promedio dada por el usuario en sus reseñas
   */
  average_stars: { type: Number, default: 0 },

  // Diversos contadores de elogios recibidos
  compliment_hot: { type: Number, default: 0 },
  compliment_more: { type: Number, default: 0 },
  compliment_profile: { type: Number, default: 0 },
  compliment_cute: { type: Number, default: 0 },
  compliment_list: { type: Number, default: 0 },
  compliment_note: { type: Number, default: 0 },
  compliment_plain: { type: Number, default: 0 },
  compliment_cool: { type: Number, default: 0 },
  compliment_funny: { type: Number, default: 0 },
  compliment_writer: { type: Number, default: 0 },
  compliment_photos: { type: Number, default: 0 },
}, {
  // Configuración para incluir campos virtuales en las representaciones JSON y de objeto
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Campo virtual para compatibilidad con el campo 'name'
 * Permite acceder al nombre a través de 'name' o 'nombre'
 */
schemaUsuario.virtual('name').get(function() {
  return this.nombre;
});

/**
 * Modelo de Mongoose para la colección 'usuario'
 * @name modelousuario
 * @type {mongoose.Model}
 */
module.exports = mongoose.model("modelousuario", schemaUsuario, "usuario");
