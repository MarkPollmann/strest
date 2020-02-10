import React, { useReducer, createContext } from "react";
import _ from "lodash";

let debug = false;

function log(...msgs: any[]) {
  if (debug) {
    console.log("STORE:", ...msgs);
  }
}

export let Store = createContext<any>({});

let persistedStateString = localStorage.getItem("stressman_state");
let persistedState = persistedStateString
  ? JSON.parse(persistedStateString)
  : {};

function next(
  stateMap: any,
  reducers: Record<string, (state: any, action: any) => any>,
  action: any
) {
  const entries = Object.entries(reducers);

  let newState: any = {};
  for (let i = 0; i < entries.length; i++) {
    const [k, r] = entries[i];
    newState[k] = r(stateMap[k], action);
  }

  return newState;
}

const persist = _.debounce((state: any) => {
  localStorage.setItem("stressman_state", JSON.stringify(state));
}, 500);

export const createStoreProvider = (reducers: Record<string, () => any>) => ({
  children
}: any) => {
  const combinedReducer = (state: any, action: any) => {
    log("Action Received", action);
    const nextState = next(state, reducers, action);
    // persist state for next pass
    persist(nextState);

    return nextState;
  };

  const [state, dispatch] = useReducer(
    combinedReducer,
    next(persistedState || {}, reducers, { type: "INIT" })
  );

  function getState() {
    return state;
  }

  return (
    <Store.Provider value={{ state, dispatch, getState }}>
      {children}
    </Store.Provider>
  );
};
