import { createSignal } from "solid-js";

const useLog = () => {
  interface Log {
    message: string;
    type: "log" | "error";
    timestamp: number;
  }

  const [logs, setLogs] = createSignal<Log[]>([]);

  const log = (message: string) => {
    setLogs((l) =>
      l.concat({
        message,
        type: "log",
        timestamp: Date.now(),
      }),
    );
  };
  const error = (message: string) => {
    setLogs((l) =>
      l.concat({
        message,
        type: "error",
        timestamp: Date.now(),
      }),
    );
  };
  const info = (message: string) => {
    setLogs((l) =>
      l.concat({
        message,
        type: "log",
        timestamp: Date.now(),
      }),
    );
  };
  const clear = () => {
    setLogs([]);
  };

  return {
    logs,
    logger: {
      log,
      error,
      info,
      clear,
    },
  };
};

export const { logs, logger } = useLog();
