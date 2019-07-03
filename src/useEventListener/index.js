import { useState } from 'react';

const useEventListener = ({ useStateDep = useState } = {}) => {
  const [callCount, setState] = useStateDep(0);

  const trigger = () => {
    setState(prevState => prevState + 1);
  };
  return {
    callCount,
    trigger,
  };
};

export default useEventListener;
