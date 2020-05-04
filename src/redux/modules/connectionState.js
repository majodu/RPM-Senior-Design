import {createSelector} from 'reselect';

export const dataModes = Object.freeze({HASH: 1, VIDEO: 2});
export const connectionModes = Object.freeze({INTERNET: 4, P2P: 5, LOCAL: 6});
const initialState = {
  dataMode: dataModes.VIDEO,
  connectionMode: connectionModes.INTERNET,
  myConnectedPeer: null, // null means that I am already connected to the internet
};

// Action Creators

// Actions
const SETDATAMODE = 'comState/SETDATAMODE';
const SETCONNECTIONMODE = 'comState/SETCONNECTIONMODE';
const SETPEER = 'comState/SETPEER';
const DONOTHING = 'nothing';
// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SETPEER:
      return Object.assign({}, state, {
        myConnectedPeer: action.id,
      });
    case SETDATAMODE:
      return Object.assign({}, state, {
        dataMode: action.mode,
      });
    // Perform action
    case SETCONNECTIONMODE:
      return Object.assign({}, state, {
        connectionMode: action.mode,
      });
    default:
      return state;
  }
}

// ACTION CREATORS
export function setDataMode(mode) {
  if (mode < 1 && mode > 3) {
    console.log('I DID NOTHING');
    return {type: DONOTHING};
  }
  return {type: SETDATAMODE, mode: mode};
}

export function setConnectionMode(mode) {
  if (mode < 4 && mode > 6) {
    console.log('I DID NOTHING');
    return {type: DONOTHING};
  }
  return {type: SETCONNECTIONMODE, mode: mode};
}
export function setPeer(id) {
  return {type: SETPEER, id};
}
