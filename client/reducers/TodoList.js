module.exports = (state=[], action) => {
  switch (action.type) {

    case 'ADD_TASK':
      return [...state, {
        id: action.id,
        done: action.done,
        text: action.text
      }];

    case 'EDIT_TASK':
      return state.map((item) => {
        if (item.id === action.id){
          item.done = action.done;
          item.text = action.text;
        }
        return item;
      });

    case 'REMOVE_TASK':
      return state.filter((item) => item.id !== action.id);

    default:
      return state;
  }
};
