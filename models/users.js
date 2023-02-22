const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  avatar: { type: String, required: true, max: 100 },
  number: { type: String, required: true, max: 1000000000 },
});

const Usuarios = mongoose.model('usuarios', userSchema);
module.exports = Usuarios;
