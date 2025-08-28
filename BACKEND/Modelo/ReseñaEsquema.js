const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schemaReseñas = new Schema({

  review_id: {
    type: String,
    required: true, 
    unique: true    // Es una buena práctica asegurar que los IDs de reseña sean únicos
  },
  user_id: {
    type: String,
    required: true,
  },
  business_id: {
    type: String,
    required: true, 
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
    required: true, 
  },
  useful: {
    type: Number,
    default: 0,
  },
  funny: {
    type: Number,
    default: 0,
  },
  cool: {
    type: Number,
    default: 0,
  },
  text: {
    type: String,
    required: true, 
  },

  date: {
    type: String,
    required: true, 
  },
});


module.exports = mongoose.model("modeloReseña", schemaReseñas, "resenas");