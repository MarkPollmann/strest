import React, { useReducer, createContext } from "react";

export const Store = createContext<any>({});

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

export const createStoreProvider = (reducers: Record<string, () => any>) => ({
  children
}: any) => {
  const combinedReducer = (state: any, action: any) =>
    next(state, reducers, action);

  const [state, dispatch] = useReducer(
    combinedReducer,
    next({}, reducers, { type: "INIT" })
  );

  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};
