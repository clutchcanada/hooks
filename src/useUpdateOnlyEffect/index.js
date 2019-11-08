import { useRef, useEffect } from "react";

const useUpdateOnlyEffect = (fn, changeArray = []) => {
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    fn();
  }, changeArray);
};

export default useUpdateOnlyEffect;