import { useState } from 'react';
import * as R from 'ramda';

const useObjectState = ({ initialState = {}, useStateDep = useState }) => {
  const [state, setState] = useStateDep(initialState);

  const update = R.pipe(R.mergeRight(state), setState);

  const updateOne = R.curry(R.pipe(R.objOf, update));

  const reset = (value = initialState) => setState(value);

  return {
    value: state,
    update,
    updateOne,
    reset,
  };
};

export default useObjectState;
