import { useEffect, useRef } from "react";

const useInterval = (callback, delay) => {
  const callbackRef = useRef();

  useEffect(() => {
    callbackRef.current = callback;
  },[callback]);

  useEffect(() => {
    const intervalFunction = () => {
      callbackRef.current(); 
    };

    if(delay !== null) {
      const interval = setInterval(intervalFunction);
      return () => {
        clearInterval(interval);
      }
    }
  },[delay])
};

export default useInterval;