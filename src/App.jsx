import React from "react";
import Upload from "./Upload";
import { Provider } from "react-redux";
import { dataStore, persistor } from "./store/index";
import { PersistGate } from "redux-persist/integration/react";
function App() {
  return (
    <Provider store={dataStore}>
      <PersistGate Loading={null} persistor={persistor}>
        <Upload />
      </PersistGate>
    </Provider>
  );
}

export default App;
