const levelup = require('levelup');
const shortid = require('shortid');

module.exports = (path) => {

  // открытие существующей / создание новой db и наполнение данными
  const db = levelup(path);
  db.get('tasks', (err, val) => {
    if (err && err.notFound) {
      db.put('tasks', [], {
        valueEncoding: 'json'
      });
    }
  });

  this.getAllTasks = () => new Promise((res, rej) => {
    db.get('tasks', {
      valueEncoding: 'json'
    }, (err, tasks) => {
      if (err) rej(err);

      var promises = [];
      for (let id of tasks){
        promises.push(new Promise((res, rej) => {
          db.get(id, {
            valueEncoding: 'json'
          }, (err, task) => {
            if (err) rej(err);
            res(task);
          })
        }));
      }

      Promise.all(promises).then((tasks) => {
        res(tasks);
      }).catch((err) => {
        rej(err);
      });

    });
  });

  this.getTask = (id) => new Promise((res, rej) => {
    db.get(id, {
      valueEncoding: 'json'
    }, (err, task) => {
      if (err) rej(err);
      res(task);
    })
  });

  this.addTask = (done, text) => new Promise((res, rej) => {
    db.get('tasks', {
      valueEncoding: 'json'
    }, (err, tasks) => {
      if (err) rej(err);

      var id = shortid.generate();

      db.put(id, {
        id: id,
        done: done,
        text: text
      }, {
        valueEncoding: 'json'
      }, (err) => {
        if (err) rej(err);

        tasks.push(id);
        db.put('tasks', tasks, {
          valueEncoding: 'json'
        }, (err) => {
          if (err) rej(err);

          res(id);
        });
      });
    });
  });

  this.removeTask = (id) => new Promise((res, rej) => {
    db.get('tasks', {
      valueEncoding: 'json'
    }, (err, tasks) => {
      if (err) rej(err);

      db.del(id, {
        valueEncoding: 'json'
      }, (err) => {
        if (err) rej(err);

        tasks = tasks.filter((item) => item !== id);
        db.put('tasks', tasks, {
          valueEncoding: 'json'
        }, (err) => {
          if (err) rej(err);

          res();
        });
      });

    });
  });

  this.changeTask = (id, done, text) => new Promise((res, rej) => {
    this.getTask(id).then(() => {
      db.put(id, {
        id: id,
        done: done,
        text: text
      }, {
        valueEncoding: 'json'
      }, (err) => {
        if (err) rej(err);
        res();
      })
    }).catch((err) => {
      rej(err);
    });
  });

  return this;

};
