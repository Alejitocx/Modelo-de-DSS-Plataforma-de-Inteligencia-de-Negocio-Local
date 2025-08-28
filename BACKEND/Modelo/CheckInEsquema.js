
const mongoose = require ("mongoose");

const Schema = mongoose.Schema;

const schemaCheckin = new Schema ({
 
  /**
   * El ID del negocio al que pertenecen los check-ins.
   * Es único porque cada documento de check-in agrupa todas las fechas para un solo negocio.
   */
  business_id:{
    type: String,
    required: true, 
    unique: true,
    index: true 
  },

  /**
   * Una cadena de texto que contiene todas las fechas y horas de los check-ins,
   * separadas por comas.
   */
  date: {
    type: String,
    required: true, 
  }
});


module.exports = mongoose.model("ModeloCheckin", schemaCheckin, "checkin");





