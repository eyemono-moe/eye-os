import { type Accessor } from "solid-js";

type FN<Arguments extends unknown[], Return = void> = (
  ...args: Arguments
) => Return;
type MaybeAccessor<T = unknown> = Accessor<T> | T;
const isFunction = (value: unknown): value is (...args: unknown[]) => unknown =>
  typeof value === "function";
const unwrap = <T>(maybeValue: MaybeAccessor<T>): T =>
  isFunction(maybeValue) ? maybeValue() : maybeValue;

interface Scheduler<T, U> {
  loop?: MaybeAccessor<boolean>;
  callback: MaybeAccessor<FN<[U]>>;
  cancel: FN<[T]>;
  schedule: (callback: FN<[U]>) => T;
}

export const createScheduler = <T, U>({
  loop,
  callback,
  cancel,
  schedule,
}: Scheduler<T, U>): (() => void) => {
  let tickId: T;
  const work = (): void => {
    if (unwrap(loop) ?? false) tick();
    unwrap(callback);
  };

  const tick = (): void => {
    tickId = schedule(work);
  };

  const dispose = (): void => {
    cancel(tickId);
  };

  tick();
  return dispose;
};

export const createAnimationLoop = (
  callback: FrameRequestCallback,
): (() => void) =>
  createScheduler({
    loop: true,
    callback,
    cancel: cancelAnimationFrame,
    schedule: requestAnimationFrame,
  });
