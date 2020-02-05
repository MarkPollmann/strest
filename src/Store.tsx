import React, { useReducer, createContext } from "react";

export const Store = createContext<any>({});

export const createStoreProvider = (
  initialState: any = {},
  reducers: any[]
) => ({ children }: any) => {
  const combinedReducer = (state: any, action: any) =>
    reducers.reduce((prevState, reducer) => reducer(prevState, action), state);

  const [state, dispatch] = useReducer(combinedReducer, initialState);

  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};
