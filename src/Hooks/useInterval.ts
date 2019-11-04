import { useEffect, useRef } from 'react';

export function useInterval(callback: () => unknown, delay: number) {
  const savedCallback = useRef<() => unknown>() ;

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);


  // Set up the interval.
  useEffect(() => {
    const handler = () => savedCallback.current!();

    if (delay !== null) {
      let id = setInterval(handler, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}