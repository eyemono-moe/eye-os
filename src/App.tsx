import { type Component } from "solid-js";

import Layout from "./components/Layout";
import { WindowsProvider } from "./contexts/useWindows";

const App: Component = () => {
  return (
    <WindowsProvider>
      <Layout />
    </WindowsProvider>
  );
};

export default App;
