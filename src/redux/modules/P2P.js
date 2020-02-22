const initialState = {
  connectionMode: false,
  dataMode: false,
  //peer_id as the key and the other data as the body
  connectedPeers: {},
  openInvitations: [],
};

// Actions
const SET = 'todo/SET';

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET:
      // Perform action
      return state;
    default:
      return state;
  }
}

// Action Creators
export function set() {
  return {type: SET};
}
