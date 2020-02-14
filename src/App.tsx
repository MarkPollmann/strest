import React, { useEffect } from "react";
import { LeftBar, Row } from "./component";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./Store";
import { MainView } from "./component/MainView.component";
import MouseTrap from 'mousetrap';
import { startTheTrain, addNewTemplate } from "./action/request.action";

export default function App() {
  useEffect(() => {
    // Register global shortcuts
    MouseTrap.bind(['command+r', 'control+r'], startTheTrain);

    MouseTrap.bind(['command+n', 'control+n'], addNewTemplate);
  })

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
