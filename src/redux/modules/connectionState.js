const initialState = {
  dataMode: 'HASH',
  connectionMode: false,
};

// Actions
const SETDATAMODE = 'comState/SETDATAMODE';
const SETCONNECTIONMODE = 'comState/SETCONNECTIONMODE';

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SETDATAMODE:
      // Perform action
      return state;
    case SETCONNECTIONMODE:
      // do something
      return state;
    default:
      return state;
  }
}

// Action Creators
const dataModes = ['HASH', 'VIDEO', 'LIVESTREAM'];
const connectionModes = ['CELLULAR', 'P2P', 'LOCAL'];

export function setDataMode(mode) {
  if (!dataModes.includes(mode)) {
    return null;
  }
  return {type: SETDATAMODE, mode: mode};
}

export function setConnectionMode(mode) {
  if (!connectionModes.includes(mode)) {
    return null;
  }
  return {type: SETCONNECTIONMODE, mode: mode};
}
