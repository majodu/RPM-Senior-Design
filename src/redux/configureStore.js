import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
//redux persist
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import FSStorage from 'redux-persist-fs-storage';

import logger from 'redux-logger';
import connectionState from './modules/connectionState';
import metadataState from './modules/metadata';
import idState from './modules/ID';
import fqueue from './modules/ForwardQueue';
const persistConfig = {
  key: 'root',
  keyPrefix: '',
  storage: FSStorage(),
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
};

// const createStoreWithMiddleware = applyMiddleware(loggerMiddleware)(createStore,); // apply logger to redux

const rootReducer = combineReducers({
  connectionState,
  metadataState,
  fqueue,
  idState,
});

const pReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  pReducer,
  {},
  //   composeEnhancers(applyMiddleware(logger)),
  composeEnhancers(),
);
// export const persistor = persistStore(store);
export default store;
