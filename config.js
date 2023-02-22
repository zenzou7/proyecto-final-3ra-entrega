if (process.env.MODE != 'production') {
  require('dotenv').config();
}

module.exports = {
  SECRET: process.env.SECRET,
  HOST: process.env.HOST,
  MONGOURL: process.env.MONGOURL,
  PORT: process.env.PORT,
};
