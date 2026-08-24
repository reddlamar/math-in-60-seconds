import { useCallback, useEffect, useRef, useState } from 'react';

const TICK_MS = 100;

export type UseGameTimerResult = {
  timeLeft: number;
  isRunning: boolean;
  start: () => void;
  reset: () => void;
};

export function useGameTimer(durationMs: number, onExpire: () => void): UseGameTimerResult {
  const [timeLeft, setTimeLeft] = useState(durationMs);
  const [isRunning, setIsRunning] = useState(false);
  const endTimeRef = useRef<number | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    const id = setInterval(() => {
      const remaining = Math.max(0, (endTimeRef.current ?? Date.now()) - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(id);
        setIsRunning(false);
        onExpireRef.current();
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [isRunning]);

  const start = useCallback(() => {
    endTimeRef.current = Date.now() + durationMs;
    setTimeLeft(durationMs);
    setIsRunning(true);
  }, [durationMs]);

  const reset = useCallback(() => {
    endTimeRef.current = null;
    setIsRunning(false);
    setTimeLeft(durationMs);
  }, [durationMs]);

  return { timeLeft, isRunning, start, reset };
}
