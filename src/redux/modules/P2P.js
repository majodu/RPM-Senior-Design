const initialState = {
  connectedPeers: [],
  openInvitations: [],
};

// Actions
const ADDPEER = 'p2p/SET';
const RMPEER = 'p2p/SET';
const ADDINVITE = 'p2p/ADDINVITE';
const RMINVITE = 'p2p/RMINVITE';
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
