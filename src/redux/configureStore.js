import {createStore, applyMiddleware, combineReducers} from 'redux';
//redux persist
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import FSStorage from 'redux-persist-fs-storage';

import logger from 'redux-logger';
import todo from './modules/todo';

const persistConfig = {
  key: 'root',
  keyPrefix: '',
  storage: FSStorage(),
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
};

// const createStoreWithMiddleware = applyMiddleware(loggerMiddleware)(createStore,); // apply logger to redux

const rootReducer = combineReducers({
  todo,
});

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer, {}, applyMiddleware(logger));
export const persistor = persistStore(store);
// export default store;
