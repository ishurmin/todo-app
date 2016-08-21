const request = require('request');

function makeRequest(method, path, data={}) {
  return new Promise((res, rej) => {
    request.post({
      url: window.location.protocol + '//' + window.location.host + '/api',
      headers: {
        'content-type': 'multipart/form-data',
      },
      multipart: {
        chunked: false,
        data:[
          {
            'Content-Disposition': 'form-data; name="data"',
            'Content-Type': 'application/json',
            body: JSON.stringify({
              method: method,
              path: path,
              data: data
            })
          }
        ]
      }
    }, (err, response, body) => {
      if (err) rej(err);

      if (body.result && body.result == 'error') rej(Error(body.message));

      res(JSON.parse(body));
    });
  });
}

var addTaskLocal = (id, done, text) => ({
  type: 'ADD_TASK',
  id: id,
  done: done,
  text: text
});

var changeTaskLocal = (id, done, text) => ({
  type: 'EDIT_TASK',
  id: id,
  done: done,
  text: text
});

var removeTaskLocal = (id) => ({
  type: 'REMOVE_TASK',
  id: id
})

var addTask = (done, text) => (dispatch) => {
  makeRequest('POST', '/todos', {
    done: done,
    text: text
  }).then((body) => {
    dispatch(addTaskLocal(body.id, done, text));
  }).catch((err) => {
    console.log(err);
  });
};

var removeTask = (id) => (dispatch) => {
  dispatch(removeTaskLocal(id));
  makeRequest('DELETE', '/todos/' + id).then((task) => {
    //---
  }).catch((err) => {
    console.log(err);
  });
};

var changeTask = (id, done, text) => (dispatch) => {
  dispatch(changeTaskLocal(id, done, text));
  makeRequest('PUT', '/todos/' + id, {
    done: done,
    text: text
  }).then(() => {
    // ---
  }).catch((err) => {
    console.log(err);
  });
};

var loadTasks = () => (dispatch) => {
  makeRequest('GET', '/todos').then((tasks) => {
    tasks.forEach((item) => {
      dispatch(addTaskLocal(item.id, item.done, item.text));
    })
  }).catch((err) => {
    console.log(err);
  });
};

module.exports = {
  addTask: addTask,
  changeTask: changeTask,
  removeTask: removeTask,
  loadTasks: loadTasks
};
