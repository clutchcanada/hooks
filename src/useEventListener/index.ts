import { useState } from 'react';

type EventListenerInitialState = {
  useStateDep?: typeof useState;
};

export const useEventListener = ({
  useStateDep = useState,
}: EventListenerInitialState) => {
  const [callCount, setState] = useStateDep(0);

  const trigger = () => {
    setState((prevState) => prevState + 1);
  };

  const reset = () => {
    setState(0);
  };

  return {
    callCount,
    trigger,
    reset,
  };
};
