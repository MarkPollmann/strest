import React from "react";
import { LeftBar, Row } from "./component";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./Store";
import { MainView } from "./component/MainView.component";

export default function App() {
  // @TODO: Fix types here later

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Row>
          <LeftBar />
          <MainView />
        </Row>
      </PersistGate>
    </Provider>
  );
}
