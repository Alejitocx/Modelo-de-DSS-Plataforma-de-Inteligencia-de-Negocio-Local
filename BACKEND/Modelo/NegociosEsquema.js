const mongoose= require("mongoose");

const schemaNegocios = new Schema ({
   _id:  { type: String }, 
   address:{
    type: String,
   
  },
   attributes:{
    type: String,
    requiered: true
  },

  business_id:{
    type: String,
    requiered: true,
    unique: true
  },
  categories: {
    type: String,
   
  },
  city: {
    type: String,
   
  },
  hours: {
    type: Object,
    requiered: true,
  },
  is_open: {
    type: Boolean,
    requiered: true,
  },
  latitude: {
    type: Number,
   
  },
  longitude: {
    type: Number,
   
  },
  name: {
    type: String,
    requiered: true,
  },
  postal_code: {
    type: String,
    requiered: true,
  },
  review_count: {
    type: Number,
    default: 0,
  },
  stars: {
    type: Number,
    min: 0,
    max:5,
  },
  state: {
    type: String,
    requiered: true,
  }
});
module.exports= mongoose.model("ModeloNegocios", schemaNegocios);