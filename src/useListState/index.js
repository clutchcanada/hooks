import { useState } from 'react';
import * as R from 'ramda';
import { throwError } from '@clutch/helpers';

const reduceArrayToObject = (accumulator, value) => ({
  ...accumulator,
  [value.key]: value
});

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
    const newState = R.assoc(item.key, item, objectListState);
    setListState(Object.values(newState));
    setObjectState(newState);
  };

  const removeListItem = item => {
    removeListItemSideEffects.forEach(R.applyTo(item));
    const newState = R.omit([item.key], objectListState);
    setListState(Object.values(newState));
    setObjectState(newState);
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
  
    const mapItem = fn =>
      R.map(({ item }) => fn(item),
        listState,
      );

    const updateListItem = item => {
      const newItem = R.merge(objectListState[item.key], item);
      const newState = R.assoc(item.key, newItem, objectListState);
      setListState(Object.values(newState));
      setObjectState(newState);
    };
  
    const setState = (newArray) => {
      const newState = newArray.reduce(reduceArrayToObject);
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
    mapItem,
  };
};

export default useListState;
