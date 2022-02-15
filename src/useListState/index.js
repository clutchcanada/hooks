import { useState } from 'react';
import * as R from 'ramda';
import { throwError } from '@clutch/helpers';
import * as useListStateUtils from './utils';
import useEventListener from '../useEventListener';

export const useListState = ({
  initialValue = [],
  addListItemSideEffects = [],
  removeListItemSideEffects = [],
  updateListItemSideEffects = [],
  uniqueKey = 'key',
  useStateDep = useState,
} = {}) => {
  const checkItemHasKey = (item) => {
    useListStateUtils.throwErrorIfKeyIsNil(item[uniqueKey]);
    return item;
  };
  const initialHashMapState = useListStateUtils.arrayToHashMap(
    initialValue,
    uniqueKey,
  );
  const [{ list: listState, hashMap: hashMapState }, setState] = useStateDep({
    list: initialValue,
    hashMap: initialHashMapState,
  });
  const changeListener = useEventListener({ useStateDep });

  const itemInStateForKey = (keyToCheck) => hashMapState.has(keyToCheck);
  const throwIfItemIsInState = (item) =>
    itemInStateForKey(item[uniqueKey])
      ? throwError(
          `An item in state already exists for this key value... selectedFilterId: ${
            item[uniqueKey]
          }, uniqueHashMap: ${JSON.stringify(Array.from(hashMapState))}`,
        )
      : item;
  const throwIfKeyIsNotInState = (key) =>
    !itemInStateForKey(key) && throwError('No item in state with this key');
  const throwIfItemIsNotInState = (item) => {
    throwIfKeyIsNotInState(item[uniqueKey]);
    return item;
  };

  const addListItem = (item) => {
    addListItemSideEffects.forEach(R.applyTo(item));

    setState((prevState) => {
      prevState.hashMap.set(item[uniqueKey], item);
      prevState.list = [...prevState.hashMap.values()];
      return {
        ...prevState,
      };
    });
  };

  const removeListItem = (item) => {
    removeListItemSideEffects.forEach(R.applyTo(item));
    setState((prevState) => {
      prevState.hashMap.delete(item[uniqueKey]);
      prevState.list = [...prevState.hashMap.values()];
      return {
        ...prevState,
      };
    });
  };

  const updateListItem = (item) => {
    updateListItemSideEffects.forEach(R.applyTo(item));
    const key = item[uniqueKey];
    setState((prevState) => {
      useListStateUtils.deepMerge(prevState.hashMap.get(key), item);
      return {
        ...prevState,
      };
    });
  };

  const toggleListItem = R.ifElse(
    R.pipe(R.prop(uniqueKey), itemInStateForKey),
    removeListItem,
    addListItem,
  );

  const clearList = () => {
    setState((prevState) => {
      prevState.hashMap.clear();
      prevState.list = [];
      return {
        ...prevState,
      };
    });
  };

  const publicSetState = (paramGiven) => {
    if (R.is(Function, paramGiven)) {
      const mappingFunction = paramGiven;
      setState((prevState) => {
        const newList = mappingFunction(prevState.list);
        const newHashMap = useListStateUtils.arrayToHashMap(newList, uniqueKey);
        prevState.hashMap = newHashMap;
        prevState.list = [...newHashMap.values()];
        return { ...prevState };
      });
    } else {
      const newArray = paramGiven;
      const newHashMap = useListStateUtils.arrayToHashMap(newArray, uniqueKey);
      setState((prevState) => {
        prevState.hashMap = newHashMap;
        prevState.list = [...newHashMap.values()];
        return { ...prevState };
      });
    }
  };

  const getItemForKey = (key) => ({
    ...hashMapState.get(key),
  });

  return {
    listState,
    addListItem: R.pipe(
      checkItemHasKey,
      throwIfItemIsInState,
      addListItem,
      changeListener.trigger,
    ),
    removeListItem: R.pipe(
      checkItemHasKey,
      throwIfItemIsNotInState,
      removeListItem,
      changeListener.trigger,
    ),
    toggleListItem: R.pipe(
      checkItemHasKey,
      toggleListItem,
      changeListener.trigger,
    ),
    updateListItem: R.pipe(
      checkItemHasKey,
      throwIfItemIsNotInState,
      updateListItem,
      changeListener.trigger,
    ),
    getItemForKey: R.pipe(R.tap(throwIfKeyIsNotInState), getItemForKey),
    itemInStateForKey,
    setState: R.pipe(publicSetState, changeListener.trigger),
    clearList: R.pipe(clearList, changeListener.trigger),
    changeCount: changeListener.callCount,
  };
};

export default useListState;
