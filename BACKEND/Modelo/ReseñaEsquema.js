const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schemaReseñas = new Schema ({
   _id:  { type: String }, 

  business_id:{
    type: String,
    requiered: true
  },
  cool: {
    type: Number ,
    default: 0,
  },
   date: {
    type: Date,
    requiered: true,
  },
   funny: {
    type: Number,
    default: 0,
    
  },
   review_id: {
    type: String,
    requiered: true,
  },
   stars: {
    type: Number,
    min:1,
    max:5,
    requiered: true,
  },
   text: {
    type: String,
    requiered: true,
  },
   useful: {
    type: Number,
    default: 0,
  },
   user_id: {
    type: String,
    requiered: true,
  }
});
module.exports= mongoose.model("modeloReseña",schemaReseñas);