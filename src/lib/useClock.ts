import { createSignal, onCleanup } from "solid-js";

import { createAnimationLoop } from "./createScheduler";

const useClock = () => {
  const getSecondsSinceMidnight = (): number =>
    (Date.now() - new Date().setHours(0, 0, 0, 0)) / 1000;

  const [date, setDate] = createSignal(new Date());
  const [time, setTime] = createSignal(getSecondsSinceMidnight());

  const dispose = createAnimationLoop(() => {
    setTime(getSecondsSinceMidnight())
    setDate(new Date())
  });
  onCleanup(dispose);

  const year = () => date().getFullYear();
  const month = () => date().getMonth() + 1;
  const day = () => date().getDate();

  const hour = () => Math.floor(time() / 3600);
  const minute = () => Math.floor((time() % 3600) / 60);
  const second = () => Math.floor(time() % 60);


  return {
    year,
    month,
    day,
    time,
    hour,
    minute,
    second,
  };
};

export default useClock;
