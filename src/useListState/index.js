import { useState } from 'react';
import * as R from 'ramda';
import { throwError } from '@clutch/helpers';
import * as useListStateUtils from "./utils";

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

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
  const initialHashMapState = useListStateUtils.arrayToHashMap(initialValue, uniqueKey);
  const [{
    list: listState,
    hashMap: hashMapState,
  }, setState] = useStateDep({
    list: initialValue,
    hashMap: initialHashMapState,
  });


  const itemInStateForKey = keyToCheck => hashMapState.has(keyToCheck);
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
      prevState.hashMap.set(item[uniqueKey],item);
      prevState.list = [...prevState.hashMap.values()];
      return {
        ...prevState
      };
    });
  };

  const removeListItem = item => {
    removeListItemSideEffects.forEach(R.applyTo(item));
    setState(prevState => {
      prevState.hashMap.delete(item[uniqueKey]);
      prevState.list = [...prevState.hashMap.values()];
      return {
        ...prevState
      };
    });
  };

  const updateListItem = item => {
    updateListItemSideEffects.forEach(R.applyTo(item));
    const key = item[uniqueKey];
    setState(prevState => {
      const newItem = mergeDeep(prevState.hashMap.get(key), item);
      prevState.hashMap.set(key, newItem);
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
    setState(prevState => ({
      list: [],
      hashMap: prevState.hashMap.clear(),
    }));
  };

  const publicSetState = (newArray) => {
    const newHashMap = useListStateUtils.arrayToHashMap(newArray, uniqueKey);
    setState(prevState => {
      prevState.hashMap = newHashMap;
      prevState.list = [...newHashMap.values()];
      return { ...prevState };
    });
  };

  const getItemForKey = (key) => ({
    ...hashMapState.get(key)
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
