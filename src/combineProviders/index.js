import React from 'react';
import * as R from 'ramda';

/* 
This is complex, so we need comments. ):

1. On first call return a functional component
2. On rendering this component, recursively call combineProviders to 
  generate React tree of providers, drilling the parents props all the way down
3. On last item in the array, render and spread the drilled props.
*/
const combineProviders = (providers, firstCall = true, passedProps) => {
  const Provider = R.head(providers);
  const RemainingProviders = R.tail(providers);
  if (!firstCall && !RemainingProviders.length) {
    return <Provider {...passedProps} />;
  }
  if (!firstCall) {
    return (
      <Provider>
        {combineProviders(RemainingProviders, false, passedProps)}
      </Provider>
    );
  }
  return parentProps => (
    <Provider>
      {combineProviders(RemainingProviders, false, parentProps)}
    </Provider>
  );
};

export default combineProviders;