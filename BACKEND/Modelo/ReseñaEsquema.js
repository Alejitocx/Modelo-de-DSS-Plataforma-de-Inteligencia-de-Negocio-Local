const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Esquema para almacenar reseñas de usuarios sobre negocios
 * @typedef {Object} SchemaReseñas
 * @property {string} review_id - ID único de la reseña (requerido, único)
 * @property {string} user_id - ID del usuario que creó la reseña (requerido)
 * @property {string} business_id - ID del negocio reseñado (requerido)
 * @property {number} stars - Calificación con estrellas (1-5, requerido)
 * @property {number} useful - Contador de votos "útil" (default: 0)
 * @property {number} funny - Contador de votos "divertido" (default: 0)
 * @property {number} cool - Contador de votos "genial" (default: 0)
 * @property {string} text - Contenido textual de la reseña (requerido)
 * @property {string} date - Fecha de la reseña (requerido)
 */
const schemaReseñas = new Schema({
  /**
   * Identificador único de la reseña
   * - Debe ser único en toda la colección
   */
  review_id: {
    type: String,
    required: true, 
    unique: true
  },
  
  /**
   * Identificador del usuario que creó la reseña
   */
  user_id: {
    type: String,
    required: true,
  },
  
  /**
   * Identificador del negocio siendo reseñado
   */
  business_id: {
    type: String,
    required: true, 
  },
  
  /**
   * Calificación en estrellas asignada por el usuario
   * - Valor entre 1 y 5
   */
  stars: {
    type: Number,
    min: 1,
    max: 5,
    required: true, 
  },
  
  /**
   * Contador de votos "útil" recibidos por la reseña
   * - Valor por defecto: 0
   */
  useful: {
    type: Number,
    default: 0,
  },
  
  /**
   * Contador de votos "divertido" recibidos por la reseña
   * - Valor por defecto: 0
   */
  funny: {
    type: Number,
    default: 0,
  },
  
  /**
   * Contador de votos "genial" recibidos por la reseña
   * - Valor por defecto: 0
   */
  cool: {
    type: Number,
    default: 0,
  },
  
  /**
   * Contenido textual completo de la reseña
   * - Incluye la opinión y experiencias del usuario
   */
  text: {
    type: String,
    required: true, 
  },

  /**
   * Fecha en que se realizó la reseña
   * - Almacenada como cadena de texto
   */
  date: {
    type: String,
    required: true, 
  },
});

/**
 * Modelo de Mongoose para la colección 'resenas'
 * @name modeloReseña
 * @type {mongoose.Model}
 */
module.exports = mongoose.model("modeloReseña", schemaReseñas, "resenas");
