const ContainerMongo = require('../containers/ContainerMongo.js');
const productos = require('../../models/productos.js');

class productosDaoMongo extends ContainerMongo {
  constructor() {
    super(productos);
  }
}

module.exports = productosDaoMongo;
