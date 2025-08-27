
const mongoose = require ("mongoose");


const schemaCheckin = new Schema ({
  _id:  { type: String }, 
  business_id:{
    type: String,
    requiered: true,
    unique: true
  },
  date: {
    type: String,
    requiered: true,
  }
});

module.exports = mongoose.model("ModeloCheckin", schemaCheckin);








