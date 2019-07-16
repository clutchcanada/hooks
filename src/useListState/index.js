import { useState } from 'react';
import * as R from 'ramda';
import { throwError } from '@clutch/helpers';

const reduceArrayToObject = (accumulator, value) => {
  accumulator[value.key] = value;
  return accumulator;
};

export const useListState = ({
  initialValue = [],
  addListItemSideEffects = [],
  removeListItemSideEffects = [],
  useStateDep = useState,
} = {}) => {
  const checkItemHasKey = item =>
    !item.key ? throwError('List item must have a key value') : item;
  const [objectListState, setObjectState] = useStateDep(initialValue.map(checkItemHasKey).reduce(reduceArrayToObject, {}));
  const [ listState, setListState ] = useStateDep(Object.values(objectListState));

  const itemInStateForKey = keyToCheck => objectListState[keyToCheck];
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
    objectListState[item.key] = item;
    setListState(Object.values(objectListState));
    setObjectState(objectListState);
  };

  const removeListItem = item => {
    removeListItemSideEffects.forEach(R.applyTo(item));
    delete objectListState[item.key];
    setListState(Object.values(objectListState));
    setObjectState(objectListState);
  };

  const toggleListItem = R.ifElse(
      R.pipe(
        R.prop("key"),
        itemInStateForKey,
      ),
      removeListItem,
      addListItem,
    );

    const clearList = () => {
      setListState([]);
      setObjectState({});
    };

    const updateListItem = item => {
      const newItem = R.mergeDeepRight(objectListState[item.key], item);
      objectListState[item.key] = newItem;
      setListState(Object.values(objectListState));
      setObjectState(objectListState);
    };
  
    const setState = (newArray) => {
      const newState = newArray.map(checkItemHasKey).reduce(reduceArrayToObject, {});
      setListState(Object.values(newState)); 
      setObjectState(newState);
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
  };
};

export default useListState;
