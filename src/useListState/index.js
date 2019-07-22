import { useState } from 'react';
import * as R from 'ramda';
import { throwError } from '@clutch/helpers';
import * as useListStateUtils from "./utils";


export const useListState = ({
  initialValue = [],
  addListItemSideEffects = [],
  removeListItemSideEffects = [],
  updateListItemSideEffects = [],
  useStateDep = useState,
} = {}) => {
  const checkItemHasKey = item => {
    useListStateUtils.throwErrorIfKeyIsNil(item.key);
    return item;
  };
  const initialObjectState = useListStateUtils.arrayToObjectIfKeyExists(initialValue);
  const [{
    list: listState,
    object: objectListState,
  }, setState] = useStateDep({
    list: Object.values(initialObjectState),
    object: initialObjectState,
  });


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
    
    setState(prevState => {
      prevState.object[item.key] = item;
      prevState.list = Object.values(prevState.object);
      return prevState;
    });
  };

  const removeListItem = item => {
    removeListItemSideEffects.forEach(R.applyTo(item));
    setState(prevState => {
      delete prevState.object[item.key];
      prevState.list = Object.values(prevState.object);
      return prevState;
    });
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
    setState({
      list: [],
      object: {},
    });
  };

  const updateListItem = item => {
    updateListItemSideEffects.forEach(R.applyTo(item));
    setState(prevState => {
      const newItem = R.mergeDeepRight(prevState[item.key], item);
      prevState.object[item.key] = newItem;
      prevState.list = Object.values(prevState.object);
      return prevState;
    });
  };

  const publicSetState = (newArray) => {
    const newState = useListStateUtils.arrayToObjectIfKeyExists(newArray);
    setState(prevState => {
      prevState.object = newState;
      prevState.list = Object.values(newState)
      return prevState;
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
