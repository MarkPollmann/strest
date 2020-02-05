import React, { useContext, useEffect } from "react";
import { sendRequest } from "./action/request.action";
import { createStoreProvider, Store } from "./Store";
import { reducers } from "./reducer";

function Sub() {
  const { state, dispatch } = useContext(Store);

  function onClick() {
    sendRequest(dispatch, "www.google.com");
  }

  return (
    <div className="text-l" onClick={onClick}>
      counter {JSON.stringify(state.request.responses)}
    </div>
  );
}

export default function App() {
  // @TODO: Fix types here later
  const StoreProvider = createStoreProvider(reducers as any);

  return (
    <StoreProvider>
      <Sub />
    </StoreProvider>
  );
}
