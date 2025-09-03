const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Esquema para almacenar tips o consejos de usuarios sobre negocios
 * @typedef {Object} SchemaTip
 * @property {string} user_id - ID del usuario que creó el tip (requerido)
 * @property {string} business_id - ID del negocio relacionado (requerido)
 * @property {string} text - Contenido del consejo o tip (requerido)
 * @property {string} date - Fecha de creación del tip (requerido)
 * @property {number} compliment_count - Cantidad de elogios recibidos (default: 0)
 */
const schemaTip = new Schema({
  /**
   * Identificador del usuario que creó el tip
   */
  user_id: { 
    type: String,
    required: true 
  },      
    
  /**
   * Identificador del negocio al que se refiere el tip
   */
  business_id: { 
    type: String, 
    required: true 
  },  
    
  /**
   * Contenido textual del consejo o recomendación
   */
  text: { 
    type: String, 
    required: true 
  },

  /**
   * Fecha de creación del tip
   * - Almacenada como cadena de texto
   */
  date: { 
    type: String, 
    required: true 
  },           
    
  /**
   * Contador de elogios o "me gusta" recibidos por el tip
   * - Valor por defecto: 0
   */
  compliment_count: { 
    type: Number, 
    default: 0 
  },
});

/**
 * Modelo de Mongoose para la colección 'tips'
 * @name modeloTip
 * @type {mongoose.Model}
 */
module.exports = mongoose.model("modeloTip", schemaTip, "tips");
