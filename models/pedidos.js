const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  username: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  avatar: { type: String, required: true, max: 100 },
  number: { type: String, required: true, max: 1000000000 },
  pedido: { type: Array, required: true },
});

const Pedidos = mongoose.model('pedidos', pedidoSchema);
module.exports = Pedidos;
