const express = require('express');
const redis = require('redis');
const session = require('express-session');
const redisStore = require('connect-redis')(session);

module.exports = (port) => {

  const app = express();
  const redisClient  = redis.createClient();
  const multer  = require('multer')();
  const api = require('../modules/api')('http://localhost:'+process.env.BACKEND_PORT);

  app.use(session({
    store: new redisStore(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));

  app.get('/login', (req, res) => {
    if (req.session.token) res.redirect('/');
    res.send('<form method="post"><input type="submit" value="Login"></form>');
  });

  app.post('/login', (req, res, next) => {
    api.call('GET', '/auth').then((body) => {
      req.session.token = body.token;
      res.redirect('/');
    }).catch((err) => {
      next(err);
    });
  });

  app.use((req, res, next) => {
    if (!req.session.token) res.redirect('/login');
    next();
  });

  app.post('/api', multer.array(), (req, res) => {
    if (!req.body.data) res.json({
      result: 'error',
      message: '"body" is empty'
    });

    var {method, path, data} = JSON.parse(req.body.data);
    if (!data) data = {};

    api.call(method, path, Object.assign(data, {
      token: req.session.token
    })).then((body) => {
      res.json(body);
    }).catch((err) => {
      res.json({
        result: 'error',
        message: err.toString()
      });
    })
  });

  app.use('/', express.static('public'));

  app.get('/logout', (req, res) => {
    delete req.session.token;
    res.redirect('/login');
  })

  app.use((err, req, res, next) => {
    res.send(err.toString());
  });

  app.listen(port);

}
