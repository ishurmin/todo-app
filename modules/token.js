const jwt = require('jsonwebtoken');

module.exports = (secret) => {

  this.create = () => {
    return jwt.sign({
      sub: 'user',
      iss: 'backend'
    }, secret, {
      expiresIn: '24h'
    });
  }

  this.verify = (token) => new Promise((res, rej) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) rej(err);

      res(decoded);
    });
  });

  return this;

};
