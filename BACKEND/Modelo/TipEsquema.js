const mongoose = require("mongoose");
const schemaTip = new Schema ({
   _id:   { type: String }, 
   user_id: { 
    type: String,
     required: true },      
  business_id: 
  { type: String, 
    required: true },  
  text: { 
    type: String, 
    required: true },        
  date: { 
    type: Date, 
    required: true },           
  compliment_count: { 
    type: Number, 
    default: 0 },
});
module.exports= mongoose.model("modeloTip",schemaTip);