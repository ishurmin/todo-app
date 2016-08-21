const React = require('react');
const reactRedux = require('react-redux');

const TodoItem = require('./TodoItem');
const actions = require('../actions/TodoList');

const mapStateToProps = (state) => ({
  items: state
});

const mapDispatchToProps = (dispatch) => ({
  onLoad() {
    dispatch(actions.loadTasks())
  },
  onAdd(done, text) {
    dispatch(actions.addTask(done, text));
  },
  onChange(id, done, text) {
    dispatch(actions.changeTask(id, done, text));
  },
  onRemove(id) {
    dispatch(actions.removeTask(id))
  }
});

module.exports = reactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(React.createClass({

  componentDidMount() {
    this.props.onLoad();
  },

  render() {

    var items = [...this.props.items, {
      id: null,
      done: false,
      text: ''
    }];

    return (
      <div className="todo-list">
        {
          items.map((item, index) => {
            return <TodoItem
                      id={item.id}
                      key={index}
                      done={item.done}
                      text={item.text}
                      onAdd={this.props.onAdd}
                      onChange={this.props.onChange}
                      onRemove={this.props.onRemove} />;
          })
        }
      </div>
    );

  }

}));
