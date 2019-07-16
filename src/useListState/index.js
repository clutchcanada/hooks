import { useState } from 'react';
import * as R from 'ramda';
import { throwError } from '@clutch/helpers';
import * as useListStateUtils from "./utils";

export const useListState = ({
  initialValue = [],
  addListItemSideEffects = [],
  removeListItemSideEffects = [],
  useStateDep = useState,
} = {}) => {
  const checkItemHasKey = item => {
    useListStateUtils.throwErrorIfKeyIsNil(item.key);
    return item;
  };
  const [objectListState, setObjectState] = useStateDep(useListStateUtils.arrayToObjectIfKeyExists(initialValue));
  const [ listState, setListState ] = useStateDep(Object.values(objectListState));

  const itemInStateForKey = keyToCheck => objectListState[keyToCheck];
  const throwIfItemIsInState = item =>
    itemInStateForKey(item.key)
      ? throwError('An item in state already exists for this key value')
      : item;
  const throwIfKeyIsNotInState = (key) => !itemInStateForKey(key)
      && throwError('No item in state with this key');
  const throwIfItemIsNotInState = item => {
    throwIfKeyIsNotInState(item.key);
    return item;
  };

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
    const newState = useListStateUtils.arrayToObjectIfKeyExists(newArray);
    setListState(Object.values(newState)); 
    setObjectState(newState);
  };

  const getItemForKey = (key) => ({
    ...objectListState[key]
  });

  return {
    listState,
    addListItem: R.compose(
      addListItem,
      throwIfItemIsInState,
      checkItemHasKey,
    ),
    removeListItem: R.compose(
      removeListItem,
      throwIfItemIsNotInState,
      checkItemHasKey,
    ),
    toggleListItem: R.compose(
      toggleListItem,
      checkItemHasKey,
    ),
    updateListItem: R.pipe(
      checkItemHasKey,
      throwIfItemIsNotInState,
      updateListItem
    ),
    getItemForKey: R.pipe(
      R.tap(throwIfKeyIsNotInState),
      getItemForKey,
    ),
    itemInStateForKey,
    setState,
    clearList,
  };
};

export default useListState;
