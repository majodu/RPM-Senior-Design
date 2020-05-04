const initialState = {
  //peer_id as the key and the other data as the body
  metadata: [],
};
export const metadataFmt = Object.freeze({
  hash: null,
  deviceID: null,
  startTime: null,
  endTime: null,
  recieveTime: null,
  hops: 0,
  isRecording: true,
});
// Actions
const ADD = 'metadata/ADD';
const DELETEALL = 'metadata/DELETEALL';

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case DELETEALL:
      return {metadata: []};
    case ADD:
      return Object.assign({}, state, {
        metadata: [...state.metadata, action.data],
      });
    default:
      return state;
  }
}

// Action Creators
export function add(
  hash,
  deviceID,
  startTime,
  endTime,
  recieveTime,
  hops,
  isRecording,
) {
  let data = {
    hash,
    deviceID,
    startTime,
    endTime,
    recieveTime,
    hops,
    isRecording,
  };
  return {type: ADD, data};
}

export function deleteAll() {
  return {type: DELETEALL};
}
