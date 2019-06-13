import { useState } from 'react';
import * as R from 'ramda';
import { throwError } from '@clutch/helpers';

export const useListState = ({
  initialValue = [],
  addListItemSideEffects = [],
  removeListItemSideEffects = [],
  useStateDep = useState,
} = {}) => {
  const checkItemHasKey = item =>
    !item.key ? throwError('List item must have a key value') : item;
  const [listState, setState] = useStateDep(initialValue.map(checkItemHasKey));

  const itemInStateForKey = keyToCheck =>
    listState.some(({ key }) => key === keyToCheck);
  const checkItemIsNotInState = item =>
    itemInStateForKey(item.key)
      ? throwError('An item in state already exists for this key value')
      : item;
  const checkItemIsInState = item =>
    !itemInStateForKey(item.key)
      ? throwError('No item in state with this key')
      : item;

  const addListItem = item => {
    addListItemSideEffects.forEach(R.applyTo(item));
    setState(prevState => [...prevState, item]);
  };

  const removeListItem = item => {
    removeListItemSideEffects.forEach(R.applyTo(item));
    
    setState(prevState => {
      const newState = prevState.filter(({ key }) => item.key !== key);
      return newState;
    });
  };

  const toggleListItem = item =>
    R.ifElse(
      R.partial(itemInStateForKey, [item.key]),
      removeListItem,
      addListItem,
    )(item);

    const clearList = () => {
      setState([]);
    };
  
    const mapItem = fn =>
      R.map(({ item }) => fn(item),
        listState,
      );
    const updateListItem = item => {
      setState(prevState => {
        const indexToReplace = prevState.findIndex(({ key }) => item.key === key);
        const newState = [...prevState];
        newState[indexToReplace] = item;
        return newState;
      })
    };

  return {
    listState,
    addListItem: R.compose(
      addListItem,
      checkItemIsNotInState,
      checkItemHasKey,
    ),
    removeListItem: R.compose(
      removeListItem,
      checkItemIsInState,
      checkItemHasKey,
    ),
    toggleListItem: R.compose(
      toggleListItem,
      checkItemHasKey,
    ),
    updateListItem: R.pipe(
      checkItemHasKey,
      checkItemIsInState,
      updateListItem
    ),
    itemInStateForKey,
    setState,
    clearList,
    mapItem,
  };
};

export default useListState;
