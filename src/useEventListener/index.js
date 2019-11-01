import { useState } from 'react';

const useEventListener = ({ useStateDep = useState } = {}) => {
  const [callCount, setState] = useStateDep(0);

  const trigger = () => {
    setState(prevState => prevState + 1);
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

export default useEventListener;
