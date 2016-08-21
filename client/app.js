const React = require('react');
const ReactDOM = require('react-dom');
const redux = require('redux');
const thunkMiddleware = require('redux-thunk').default;

const Provider = require('react-redux').Provider;
const TodoList = require('./components/TodoList');

const TodoListReducer = require('./reducers/TodoList');
const store = redux.createStore(TodoListReducer, [], redux.applyMiddleware(thunkMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <TodoList />
  </Provider>,
  document.getElementById('app')
);
