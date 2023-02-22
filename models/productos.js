const mongoose = require('mongoose');

const productosSchema = new mongoose.Schema({
  id: { type: Number, require: true, unique: true },
  name: { type: String, require: true },
  price: { type: Number, require: true },
  thumbnail: { type: String, require: true },
});

const productos = mongoose.model('productos', productosSchema);
module.exports = productos;
