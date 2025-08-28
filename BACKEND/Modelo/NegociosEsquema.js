const mongoose= require("mongoose");
const Schema = mongoose.Schema;

const schemaNegocios = new Schema({
  business_id: {
    type: String,
    required: true, 
    unique: true,
    index: true // Es buena práctica indexar los IDs para búsquedas rápidas
  },
  name: {
    type: String,
    required: true, 
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
    required: true, 
  },
  postal_code: {
    type: String,
    required: true, 
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  stars: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  review_count: {
    type: Number,
    default: 0,
  },
  //  Number para coincidir con los datos (0 o 1)
  is_open: {
    type: Number,
    required: true, 
  },
  //  Object para que coincida con la base de datos
  attributes: {
    type: Object,
  },
  categories: {
    type: String,
  },
  //  tipo flexible y no requerido, ya que puede ser null
  hours: {
    type: Schema.Types.Mixed,
  }
});

module.exports = mongoose.model("ModeloNegocios", schemaNegocios, "negocios");