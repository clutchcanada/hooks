import { useState } from 'react';
import * as R from 'ramda';
import { throwError } from '@clutch/helpers';
import * as useListStateUtils from "./utils";

export const useListState = ({
  initialValue = [],
  addListItemSideEffects = [],
  removeListItemSideEffects = [],
  updateListItemSideEffects = [],
  uniqueKey = "key",
  useStateDep = useState,
} = {}) => {
  const checkItemHasKey = item => {
    useListStateUtils.throwErrorIfKeyIsNil(item[uniqueKey]);
    return item;
  };
  const initialObjectState = useListStateUtils.arrayToObjectIfKeyExists(initialValue, uniqueKey);
  const [{
    list: listState,
    object: objectListState,
  }, setState] = useStateDep({
    list: Object.values(initialObjectState),
    object: initialObjectState,
  });


  const itemInStateForKey = keyToCheck => objectListState[keyToCheck];
  const throwIfItemIsInState = item =>
    itemInStateForKey(item[uniqueKey])
      ? throwError('An item in state already exists for this key value')
      : item;
  const throwIfKeyIsNotInState = (key) => !itemInStateForKey(key)
      && throwError('No item in state with this key');
  const throwIfItemIsNotInState = item => {
    throwIfKeyIsNotInState(item[uniqueKey]);
    return item;
  };

  const addListItem = item => {
    addListItemSideEffects.forEach(R.applyTo(item));
    
    setState(prevState => {
      prevState.object[item[uniqueKey]] = item;
      prevState.list = Object.values(prevState.object);
      return {
        ...prevState
      };
    });
  };

  const removeListItem = item => {
    removeListItemSideEffects.forEach(R.applyTo(item));
    setState(prevState => {
      delete prevState.object[item[uniqueKey]];
      prevState.list = Object.values(prevState.object);
      return {
        ...prevState
      };
    });
  };

  const toggleListItem = R.ifElse(
    R.pipe(
      R.prop(uniqueKey),
      itemInStateForKey,
    ),
    removeListItem,
    addListItem,
  );

  const clearList = () => {
    setState({
      list: [],
      object: {},
    });
  };

  const updateListItem = item => {
    updateListItemSideEffects.forEach(R.applyTo(item));
    const key = item[uniqueKey];
    setState(prevState => {
      const newItem = R.mergeDeepRight(prevState.object[key], item);
      prevState.object[key] = newItem;
      prevState.list = Object.values(prevState.object);
      return {
        ...prevState
      };
    });
  };

  const publicSetState = (newArray) => {
    const newState = useListStateUtils.arrayToObjectIfKeyExists(newArray, uniqueKey);
    setState(prevState => {
      prevState.object = newState;
      prevState.list = Object.values(newState)
      return { ...prevState };
    });
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
    setState: publicSetState,
    clearList,
  };
};

export default useListState;
