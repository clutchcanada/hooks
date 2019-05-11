import { useState } from 'react';
import { throwError } from '../../helpers';

export const NO_ACTIVE_KEY = 'NO_ACTIVE_KEY';

export const useAccordionState = ({
  keys,
  defaultKey = NO_ACTIVE_KEY,
  useStateDep = useState,
}) => {
  const [activeKey, setActiveKey] = useStateDep(defaultKey);

  const togglePanel = key => {
    !keys.includes(key) &&
      throwError('key must be in list of keys passed to useAccordionState');
    const openKey = key === activeKey ? NO_ACTIVE_KEY : key;
    setActiveKey(openKey);
  };

  const isActiveKey = key => key === activeKey;

  return {
    activeKey,
    togglePanel,
    isActiveKey,
    setActiveKey,
  };
};

useAccordionState.NO_ACTIVE_KEY = NO_ACTIVE_KEY;
export default useAccordionState;
