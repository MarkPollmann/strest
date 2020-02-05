import React from "react";
import { LeftBar, Row } from "./component";
import { reducers } from "./reducer";
import { createStoreProvider } from "./Store";
import { MainView } from "./component/MainView.component";

export default function App() {
  // @TODO: Fix types here later
  const StoreProvider = createStoreProvider(reducers as any);

  return (
    <StoreProvider>
      <Row>
        <LeftBar />
        <MainView />
      </Row>
    </StoreProvider>
  );
}
