import { type Component } from "solid-js";

import Layout from "./components/Layout";
import { ObsWebSocketProvider } from "./contexts/useObsWebSocket";
import { WindowsProvider } from "./contexts/useWindows";
import { logger } from "./lib/useLog";

const App: Component = () => {
  logger.log(`started eyeOS
                        ___  ____
      ___ _   _  ___   / _ \\/ ___|
     / _ \\ | | |/ _ \\ | | | \\___ \\
    |  __/ |_| |  __/ | |_| |___) |
     \\___|\\__, |\\___|  \\___/|____/
          |___/

 https://github.com/detteiu8383/eye-os
        twitter: @eyemono_moe
  `);

  return (
    <ObsWebSocketProvider>
      <WindowsProvider>
        <Layout />
      </WindowsProvider>
    </ObsWebSocketProvider>
  );
};

export default App;
