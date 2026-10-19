import { useEffect, useRef, useState } from "react";

export function useCountdown(duration: number, onEnd: () => void): number {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    let remainingMs = duration * 1000;
    let deadline = Date.now() + remainingMs;
    let ended = false;

    const tick = () => {
      if (ended || document.visibilityState === "hidden") return;
      const ms = deadline - Date.now();
      setSecondsLeft(Math.max(0, Math.ceil(ms / 1000)));
      if (ms <= 0) {
        ended = true;
        onEndRef.current();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        remainingMs = Math.max(0, deadline - Date.now());
      } else {
        deadline = Date.now() + remainingMs;
        tick();
      }
    };

    const interval = window.setInterval(tick, 100);
    document.addEventListener("visibilitychange", onVisibilityChange);
    tick();

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [duration]);

  return secondsLeft;
}
