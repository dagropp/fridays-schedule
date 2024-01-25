import { useEffect } from "react";

const DEFAULT_INTERVAL = -1;

type UsePollingOptions = {
  seconds?: number;
  fireOnMount?: boolean;
};

export function usePolling(
  callback: () => void,
  { seconds = 10, fireOnMount = true }: UsePollingOptions = {}
) {
  useEffect(() => {
    if (fireOnMount) callback();
    let interval = setInterval(callback, seconds * 1000);
    return () => {
      clearInterval(interval);
      interval = DEFAULT_INTERVAL;
    };
  }, [callback, seconds, fireOnMount]);
}
