const ContainerMongo = require('../containers/ContainerMongo.js');
const pedidos = require('../../models/pedidos.js');

class pedidosDaoMongo extends ContainerMongo {
  constructor() {
    super(pedidos);
  }
}

module.exports = pedidosDaoMongo;
