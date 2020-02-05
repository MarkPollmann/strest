import React, { useContext } from "react";
import { createStoreProvider, Store } from "./Store";
import produce from "immer";

function Sub() {
  const { state, dispatch } = useContext(Store);

  function onClick() {
    dispatch({ type: "SAMPLE ACTION" });
  }

  return (
    <div className="text-l" onClick={onClick}>
      counter {state.counter}
    </div>
  );
}

const reducers = [
  (state: any, action: any) => {
    return produce(state, (draft: any) => {
      switch (action.type) {
        default:
          break;
      }
      draft.counter++;
    });
  }
];

export default function App() {
  const StoreProvider = createStoreProvider({ counter: 0 }, reducers);

  return (
    <StoreProvider>
      <Sub />
    </StoreProvider>
  );
}
