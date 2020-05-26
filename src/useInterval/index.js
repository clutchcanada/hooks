import { useEffect, useRef } from "react";

const useInterval = (callback, delay) => {
  const callbackRef = useRef();

  useEffect(() => {
    callbackRef.current = callback;
  },[callback]);

  useEffect(() => {
    if(delay !== null) {  
      const interval = setInterval(() => {
        callbackRef.current(); 
      });
      return () => {
        clearInterval(interval);
      }
    }
  },[delay])
};

export default useInterval;