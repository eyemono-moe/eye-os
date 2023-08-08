import { type Component } from "solid-js";

import Layout from "./components/Layout";
import { ControllerProvider } from "./contexts/useObsWebSocket";
import { WindowsProvider } from "./contexts/useWindows";

const App: Component = () => {
  return (
    <ControllerProvider>
      <WindowsProvider>
        <Layout />
      </WindowsProvider>
    </ControllerProvider>
  );
};

export default App;
