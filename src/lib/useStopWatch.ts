import { createSignal, onCleanup } from "solid-js";

import { createAnimationLoop } from "./createScheduler";

const useStopWatch = () => {
  const [elapsedTime, setElapsedTime] = createSignal(0);
  const [isRunning, setIsRunning] = createSignal(false);
  const [startTime, setStartTime] = createSignal(0);

  const dispose = createAnimationLoop(() => {
    if (isRunning()) {
      setElapsedTime(Date.now() - startTime());
    }
  });
  onCleanup(dispose);

  const hour = () => Math.floor(elapsedTime() / 3600000);
  const minute = () => Math.floor((elapsedTime() % 3600000) / 60000);
  const second = () => Math.floor((elapsedTime() % 60000) / 1000);
  const millisecond = () => Math.floor(elapsedTime() % 1000);

  const start = () => {
    if (isRunning()) return;
    setIsRunning(true);
    setStartTime(Date.now() - elapsedTime());
  };

  const stop = () => {
    if (!isRunning()) return;
    setIsRunning(false);
    // setElapsedTime(Date.now() - startTime());
  };

  const reset = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };

  return {
    elapsedTime,
    hour,
    minute,
    second,
    millisecond,
    start,
    stop,
    reset,
    isRunning,
  };
};

export default useStopWatch;
