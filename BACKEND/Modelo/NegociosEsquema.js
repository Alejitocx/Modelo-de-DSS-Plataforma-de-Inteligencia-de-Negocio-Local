const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Esquema para almacenar información de negocios
 * @typedef {Object} SchemaNegocios
 * @property {string} business_id - ID único del negocio (requerido, único, indexado)
 * @property {string} name - Nombre del negocio (requerido)
 * @property {string} address - Dirección del negocio
 * @property {string} city - Ciudad donde se encuentra el negocio
 * @property {string} state - Estado donde se encuentra el negocio (requerido)
 * @property {string} postal_code - Código postal del negocio (requerido)
 * @property {number} latitude - Coordenada de latitud
 * @property {number} longitude - Coordenada de longitud
 * @property {number} stars - Calificación con estrellas (0-5, default: 0)
 * @property {number} review_count - Cantidad de reseñas (default: 0)
 * @property {number} is_open - Indicador de estado abierto/cerrado (0 o 1, requerido)
 * @property {Object} attributes - Atributos adicionales del negocio
 * @property {string} categories - Categorías del negocio
 * @property {Mixed} hours - Horarios de operación (tipo flexible)
 */
const schemaNegocios = new Schema({
  /**
   * Identificador único del negocio
   * - Indexado para búsquedas rápidas
   * - Debe ser único en la colección
   */
  business_id: {
    type: String,
    required: true, 
    unique: true,
    index: true
  },
  
  /**
   * Nombre del establecimiento comercial
   */
  name: {
    type: String,
    required: true, 
  },
  
  /**
   * Dirección física del negocio
   */
  address: {
    type: String,
  },
  
  /**
   * Ciudad donde está ubicado el negocio
   */
  city: {
    type: String,
  },
  
  /**
   * Estado o provincia donde está ubicado el negocio
   */
  state: {
    type: String,
    required: true, 
  },
  
  /**
   * Código postal de la ubicación del negocio
   */
  postal_code: {
    type: String,
    required: true, 
  },
  
  /**
   * Coordenada de latitud para geolocalización
   */
  latitude: {
    type: Number,
  },
  
  /**
   * Coordenada de longitud para geolocalización
   */
  longitude: {
    type: Number,
  },
  
  /**
   * Calificación promedio en estrellas
   * - Valor entre 0 y 5
   * - Valor por defecto: 0
   */
  stars: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  
  /**
   * Cantidad de reseñas recibidas
   * - Valor por defecto: 0
   */
  review_count: {
    type: Number,
    default: 0,
  },
  
  /**
   * Indicador de si el negocio está abierto (1) o cerrado (0)
   */
  is_open: {
    type: Number,
    required: true, 
  },
  
  /**
   * Atributos adicionales del negocio
   * - Estructura flexible en formato objeto
   * - Ejemplo: {WiFi: "free", Parking: true}
   */
  attributes: {
    type: Object,
  },
  
  /**
   * Categorías a las que pertenece el negocio
   * - Almacenadas como cadena de texto
   * - Ejemplo: "Restaurantes, Comida Mexicana"
   */
  categories: {
    type: String,
  },
  
  /**
   * Horarios de operación del negocio
   * - Tipo flexible para acomodar diferentes estructuras de datos
   * - Puede ser null o contener información de horarios
   */
  hours: {
    type: Schema.Types.Mixed,
  }
});

/**
 * Modelo de Mongoose para la colección 'negocios'
 * @name ModeloNegocios
 * @type {mongoose.Model}
 */
module.exports = mongoose.model("ModeloNegocios", schemaNegocios, "negocios");
