const request = require('request');

module.exports = (url) => {

  this.call = (method, path, body = {}) => new Promise((res, rej) => {
    request({
      url: url + path,
      method: method,
      json: true,
      body: body
    }, (err, response, body) => {
      if (err) rej(err);

      if (body.result && body.result == 'error') rej(Error(body.message));

      res(body);
    });
  });

  return this;

};
