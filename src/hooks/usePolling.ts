import { useEffect } from "react";

export function usePolling(callback: () => void, seconds: number = 10) {
  useEffect(() => {
    let interval = -1;
    callback();
    interval = setInterval(callback, seconds * 1000);
    return () => {
      clearInterval(interval);
      interval = -1;
    };
  }, [callback, seconds]);
}
