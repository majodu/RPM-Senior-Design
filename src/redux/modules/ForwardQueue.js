const initialState = {
  queue: [],
};

// Actions
const ADDQUEUE = 'queue/ADD';
const RMQUEUE = 'queue/RM';
// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADDQUEUE:
      return Object.assign({}, state, {
        queue: [...state.queue, action.data],
      });

    case RMQUEUE:
      let len = state.queue.length;
      return Object.assign({}, state, {
        queue: [...state.queue].filter(item => item !== action.data),
      });

    default:
      return state;
  }
}

// Action Creators
export function addQueue(data) {
  return {type: ADDQUEUE, data};
}

export function removeQueue(data) {
  return {type: RMQUEUE, data};
}
