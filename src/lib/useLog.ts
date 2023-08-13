import { createSignal } from "solid-js";

const stringify = (...data: any[]): string => {
  const message = data
    .map((d) => {
      if (typeof d === "string") return d;
      return JSON.stringify(d);
    })
    .join(" ");

  return message;
};

const useLog = () => {
  interface Log {
    message: string;
    type: "log" | "error";
    timestamp: number;
  }

  const [logs, setLogs] = createSignal<Log[]>([]);

  const log = (...data: any[]) => {
    const message = stringify(...data);
    setLogs((l) =>
      l.concat({
        message,
        type: "log",
        timestamp: Date.now(),
      }),
    );
  };
  const error = (...data: any[]) => {
    const message = stringify(...data);
    setLogs((l) =>
      l.concat({
        message,
        type: "error",
        timestamp: Date.now(),
      }),
    );
  };
  const clear = () => {
    setLogs([]);
  };

  window.addEventListener("error", (e) => {
    error(e.message);
  });

  return {
    logs,
    logger: {
      log,
      error,
      clear,
    },
  };
};

export const { logs, logger } = useLog();
