const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schemaUsuario = new mongoose.Schema({
 
  nombre: { 
    type: String, 
    required: true,
    alias: 'name' 
  },
  // Estos campos son para los nuevos usuarios, por eso no son requeridos
  // para no afectar a los documentos existentes.
  email: { 
    type: String, 
    required: false, // No es requerido para los datos viejos
    unique: true,
    sparse: true // Permite valores nulos en un campo único
  },
  password: { 
    type: String, 
    required: false // No es requerido para los datos viejos
  },

  // --- Campos existentes de la colección Yelp ---

  user_id: { type: String, required: true, unique: true },
  review_count: { type: Number, default: 0 },
  yelping_since: { type: String }, 
  useful: { type: Number, default: 0 },
  funny: { type: Number, default: 0 },
  cool: { type: Number, default: 0 },
  elite: { type: String }, 
  
  // Cambiado a String, ya que en la BD es una cadena de texto larga
  friends: { type: String }, 
  
  fans: { type: Number, default: 0 },
  average_stars: { type: Number, default: 0 },

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
  
  toJSON: { virtuals: true }, // Asegura que los campos virtuales se muestren en JSON
  toObject: { virtuals: true }
});

// Virtual para que 'name' y 'nombre' sean intercambiables
schemaUsuario.virtual('name').get(function() {
  return this.nombre;
});

module.exports = mongoose.model("modelousuario", schemaUsuario, "usuario");