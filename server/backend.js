const express = require('express');
const bodyParser = require('body-parser');

module.exports = (port) => {

  const db = require('../modules/db')(process.env.DB_PATH);
  const token = require('../modules/token')(process.env.TOKEN_SECRET);

  const app = express();
  
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    if (!req.body) res.sendStatus(400);
    next();
  });
  app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  // генерация токена
  app.get('/auth', (req, res) => {
    res.json({
      result: 'success',
      token: token.create()
    })
  });

  // проверка токена
  app.use((req, res, next) => {
      if (req.body.token){
          token.verify(req.body.token).then(() => {
            next();
          }).catch((err) => {
            next(err);
          });
      } else next(Error('auth failed'));
  });

  app.get('/todos', (req, res, next) => {
    db.getAllTasks().then((tasks) => {
      res.json(tasks);
    }).catch((err) => {
      next(err);
    });
  });

  app.post('/todos', (req, res, next) => {
    var {done, text} = req.body;
    if (done !== undefined && text) {
      db.addTask(done, text).then((id) => {
        res.json({
          result: 'success',
          id: id
        });
      }).catch((err) => {
        next(err);
      });
    } else {
      next(Error('parameters "done" and "text" are expected'));
    }
  });

  app.get('/todos/:id', (req, res, next) => {
    db.getTask(req.params.id).then((val) => {
      res.json(val);
    }).catch((err) => {
      next(err);
    });
  });

  app.put('/todos/:id', (req, res, next) => {
    var {done, text} = req.body;
    if (done !== undefined && text) {
      db.changeTask(req.params.id, done, text).then(() => {
        res.json({
          result: 'success'
        });
      }).catch((err) => {
        next(err);
      });
    } else {
      next(Error('parameters "done" and "text" are expected'));
    }
  });

  app.delete('/todos/:id', (req, res, next) => {
    db.removeTask(req.params.id).then(() => {
      res.json({
        result: 'success'
      });
    }).catch((err) => {
      next(err);
    });
  });

  // обработка ошибок
  app.use((err, req, res, next) => {
    res.json({
      result: 'error',
      message: err.toString()
    });
  });

  app.listen(port);

};
