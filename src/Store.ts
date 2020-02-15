import { combineReducers, createStore, compose, AnyAction } from "redux";
// import _ from "lodash";
import { requestReducer } from "./reducer";
import { persistStore, persistReducer } from "redux-persist";

import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { ActionType } from "./action/ActionType.enum";

let persistConfig = {
  key: "root",
  storage
};

let reducer = combineReducers<any, AnyAction>({
  request: requestReducer
});

let masterReducer = (state: any, action: any) => {
  // Special case, use has loaded a workflow from memory
  if (action.type === ActionType.LOAD_WORKFLOW) {
    return action.payload;
  }

  return reducer(state, action);
}

let persistedReducer = persistReducer(persistConfig, masterReducer);

let initialState = {};

// // @ts-ignore
// let complexCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//   ? // @ts-ignore
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//   : compose;

let complexCompose = compose;

let enhancer = complexCompose();

export let store = createStore(persistedReducer, initialState, enhancer);
export let persistor = persistStore(store);

export let dispatch = store.dispatch;
export let getState = store.getState;
