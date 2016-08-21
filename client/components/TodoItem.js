const React = require('react');
const classnames = require('classnames');

module.exports = React.createClass({

  handleToggle() {
    var {id, done, text, onChange} = this.props;
    onChange(id, !done, text);
  },

  handleChange(e) {
    var {id, done, text, onChange, onAdd} = this.props;
    if (id) {
      onChange(id, done, e.target.value);
    } else {
      onAdd(done, e.target.value);
    }
  },

  handleRemove(e) {
    var {id, onRemove} = this.props;
    e.target.blur();
    if (id) onRemove(id);
  },

  render() {

    var {id, done, text, onChange} = this.props;

    var itemClassname = classnames('todo-item', {
      'todo-item--empty': text.length === 0
    });

    var checkboxClassname = classnames('todo-item__checkbox', {
      'todo-item__checkbox--checked': done
    });
    var textClassname = classnames({
      'todo-item__text': true,
      'todo-item__text--crossout': done
    });

    var removeClassname = classnames({
      'todo-item__remove': true,
      'todo-item__remove--hidden': id === null
    });

    return (
      <div className={itemClassname}>
        <div
          className={checkboxClassname}
          onClick={this.handleToggle}
          onKeyPress={this.handleToggle}
          tabIndex="0"></div>
        <input
          type="text"
          className={textClassname}
          value={text}
          disabled={done}
          placeholder="Add new task"
          onChange={this.handleChange}/>
        <div
          className={removeClassname}
          onClick={this.handleRemove}
          onKeyPress={this.handleRemove}
          tabIndex="0"></div>
      </div>
    );
  }

});
