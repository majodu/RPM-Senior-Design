import {createStore, applyMiddleware, combineReducers} from 'redux';
import createLogger from 'redux-logger';
import todo from './modules/todo';
import p2p from './modules/P2P';

const loggerMiddleware = createLogger(); // initialize logger

const createStoreWithMiddleware = applyMiddleware(loggerMiddleware)(
  createStore,
); // apply logger to redux

const reducer = combineReducers({
  todo,
  p2p,
});

const configureStore = initialState =>
  createStoreWithMiddleware(reducer, initialState);
export default configureStore;
