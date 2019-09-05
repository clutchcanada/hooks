import { useState } from "react";
import * as R from "ramda";
import { throwError } from "@clutch/helpers";

const useNumberState = (initialValue = 0) => {
  const [state, setState] = useState(initialValue);

  const increment = () => setState(prevState => prevState + 1);
  const decrement = () => setState(prevState => prevState - 1);

  const setValue = R.ifElse(
    R.is(Number),
    setState,
    () => throwError("Arguement must be a number in setValue"),
  );

  return {
    value: state,
    increment,
    decrement,
    setValue,
  };
};

export default useNumberState;