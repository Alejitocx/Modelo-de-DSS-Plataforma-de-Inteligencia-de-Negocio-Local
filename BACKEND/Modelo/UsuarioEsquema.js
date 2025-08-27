const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schemaUsuario = new mongoose.Schema({
  _id: { type: String }, 
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  review_count: { type: Number, default: 0 },
  yelping_since: { type: Date },
  useful: { type: Number, default: 0 },
  funny: { type: Number, default: 0 },
  cool: { type: Number, default: 0 },
  elite: { type: String }, 
  friends: { type: [String] }, 
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
});
module.exports= mongoose.model("modeloUsuario",schemaUsuario, "Usuario");