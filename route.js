const daoMongoProductos = require('./src/DAO/daoMongoProductos.js');
const classProductos = new daoMongoProductos();
const daoMongoPedidos = require('./src/DAO/daoMongoPedidos.js');
const classPedidos = new daoMongoPedidos();
const yargs = require('yargs/yargs')(process.argv.slice(2));
const config = require('./config');
const args = yargs.default({ PORT: config.PORT }).argv;
const winston = require('winston');
const { sendCartMail } = require('./nodemailer.js');
const { sendPhoneMsg, sendWhatsAppMsg } = require('./twilio.js');

const logger = winston.createLogger({
  level: 'warn',
  transports: [new winston.transports.Console({ level: 'info' }), new winston.transports.File({ filename: 'warn.log', level: 'warn' }), new winston.transports.File({ filename: 'error.log', level: 'error' })],
});

const getRoot = async (req, res) => {
  logger.log('info', 'Get / - log info');
  try {
    const prods = await classProductos.getAll();

    res.render('pages/form', { products: prods });
  } catch (err) {
    logger.log('error', `Error in Get /: ${err}- log error`);
  }
};

const postPedidos = (req, res) => {
  logger.log('info', 'Post en /api/pedidos - log info');
  try {
    const body = req.body;

    const { username, password, number, avatar, email } = req.user;

    const pedido = {
      usuario: username,
      email: email,
      numero: number,
      avatar: avatar,
      pedido: body,
    };
    sendWhatsAppMsg(JSON.stringify(pedido.pedido));
    sendCartMail(req.user.username, pedido);
    sendPhoneMsg(req.user.number);
    console.log(pedido);
    classPedidos.save(pedido);
    res.json('Pedido hecho con exito!');
  } catch (err) {
    logger.log('error', `Error in Post /api/pedidos: ${err}- log error`);
  }
};

const getProds = (req, res) => {
  logger.log('info', 'Get /api/productos - log info');
  try {
    if (req.isAuthenticated()) {
      res.render('pages/productos');
    } else {
      res.render('pages/login');
    }
  } catch (err) {
    logger.log('error', `Error in Get /: ${err}- log error`);
  }
};

const routerPostForm = (req, res) => {
  logger.log('info', 'Post en /api/productos/form - log info');
  try {
    const body = req.body;
    classProductos.save(body);
    if (body) {
    } else {
      res.json({ error: true, msg: 'Producto no agregado' });
    }
  } catch (err) {
    logger.log('error', `Error in Post /api/productos/form: ${err}- log error`);
  }
};

const routerPostLogin = (req, res) => {
  logger.log('info', 'Post en /api/productos/login - log info');
  try {
    const { username, password, number, avatar, email } = req.user;
    const user = { username: username, password: password, number: number, avatar: avatar, email: email };
    res.render('pages/profile', { user });
  } catch (err) {
    logger.log('error', `Error in Post /api/productos/login: ${err}- log error`);
  }
};

const routerGetForm = async (req, res) => {
  logger.log('info', 'Get en /api/productos/form: - log info');
  try {
    const prods = await classProductos.getAll();

    res.render('pages/form', { products: prods });
  } catch (err) {
    logger.log('error', `Error in Get /api/productos/form: ${err}- log error`);
  }
};

const routerGetLogin = async (req, res) => {
  logger.log('info', 'Get en /api/productos/login - log info');
  if (req.isAuthenticated()) {
    const { username, password, number, avatar, email } = req.user;
    const user = { username, password, number, avatar, email };
    res.render('pages/profile', { user });
  } else {
    res.render('pages/login');
  }
};

const routerGetLogout = async (req, res) => {
  try {
    logger.log('info', 'Get en /api/productos/logout - log info');

    req.session.destroy((err) => {
      if (err) {
        res.send('no pudo deslogear');
      } else {
        res.render('pages/logout');
      }
    });
  } catch (err) {
    logger.log('error', `Error in Get /api/productos/logout: ${err}- log error`);
  }
};

const routerGetSignup = (req, res) => {
  logger.log('info', 'Get en /api/productos/signup - log info');

  if (req.isAuthenticated()) {
    const { username, password, number, avatar, email } = req.user;
    const user = { username, password, number, avatar, email };
    res.render('pages/profile', { user });
  } else {
    res.render('pages/signup');
  }
};

const routerPostSignup = (req, res) => {
  logger.log('info', 'Post en /api/productos/signup - log info');

  const { username, password, number, avatar, email } = req.body;
  const user = { username, password, number, avatar, email };
  res.render('pages/profile', { user });
};

const routerGetFailLogin = (req, res) => {
  logger.log('info', 'Get en /api/productos/fail/login - log info');

  res.render('pages/faillogin', { Port: args.port });
};

const routerGetFailSignup = (req, res) => {
  logger.log('info', 'Get en /api/productos/fail/signup - log info');
  const port = args.port;
  res.render('pages/failsignup', { Port: port });
};

const getInfo = (req, res) => {
  logger.log('info', 'get en /info - log info');

  res.json({
    Argumentos: args,
    Path: process.execPath,
    OS: process.plataform,
    ProcessId: process.pid,
    NodeVersion: process.version,
    MemoriaTotalReservada: process.memoryUsage.rss(),
    CarpetaDelProyecto: process.cwd(),
  });
};

const getRandoms = (req, res) => {
  logger.log('info', 'Get en /api/randoms- log info');

  let msg = 0;
  req.query.hasOwnProperty('cant') ? (msg = parseInt(req.query.cant)) : (msg = 10000);

  let arrayRandomNum = [];
  let arrayUsedNumber = [];
  let arrayRepeatedResult = [];
  for (let i = 0; i < msg; i++) {
    arrayRandomNum.push(Math.floor(Math.random() * 1000) + 1);
  }

  arrayRandomNum.forEach((num) => {
    if (!arrayUsedNumber.includes(num)) {
      arrayUsedNumber.push(num);
      arrayRepeatedResult.push({
        [num]: arrayRandomNum.filter((repeatedNum) => repeatedNum == num).length,
      });
    }
  });

  res.json({
    Numeros_generados: 'Usted ha generado ' + msg + ' números. Estos, agrupados por repetición, generaron un array de ' + arrayRepeatedResult.length + ' elementos',
    numeros: arrayRepeatedResult,
  });
};

const getInexistent = (req, res) => {
  logger.log('warn', 'Get en Inexistent- log warn');
  res.render('pages/inexistent', { Port: args.PORT });
};

module.exports = {
  getRoot,
  postPedidos,
  getProds,
  routerPostForm,
  routerPostLogin,
  routerGetForm,
  routerGetLogin,
  routerGetLogout,
  routerGetSignup,
  routerPostSignup,
  routerGetFailLogin,
  routerGetFailSignup,
  getRandoms,
  getInfo,
  getInexistent,
};
