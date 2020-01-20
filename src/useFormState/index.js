import { useState } from 'react';
import * as R from 'ramda';
import { useBooleanState, useAccordionState } from '../index';
import { isValidTextEntry, reduceFormKeysToState } from "./utils";

const useFormState = ({
  formKeyMap = {},
  defaultValues = {},
  optionalKeys = [],
  defaultState = {},
  useStateDep = useState,
} = {}) => {
  const {
    value: isValidating,
    setTrue: setIsValidatingTrue,
    setFalse: setIsValidatingFalse,
  } = useBooleanState({ useStateDep });
  const defaultStateWithValues = Object.entries(defaultValues).reduce((accumulator, [key, value]) => {
    accumulator[key] = {
      ...accumulator[key],
      value,
    };
    return accumulator
  }, defaultState);
  const [formState, setFormState] = useStateDep(
      R.mergeDeepRight(reduceFormKeysToState(formKeyMap), defaultStateWithValues)
    );

  const {
    togglePanel: toggleFocusKey,
    isActiveKey: isFocused,
  } = useAccordionState({ keys: R.values(formKeyMap), useStateDep });

  const updateState = R.curry(({ stateKey }, formKey, value) => {
    setFormState(prevState => ({
      ...prevState,
      [formKey]: {
        ...prevState[formKey],
        [stateKey]: value,
      },
    }));
    return value;
  });

  const getValueForKey = key => R.path([key, 'value'], formState);
  const getIsDisabledForKey = key => R.path([key, 'disabled'], formState);
  const getErrorForKey = key => R.path([key, 'error'], formState);
  const getErrorMessageForKey = key => R.path([key, 'errorMessage'], formState);

  const reset = () => {
    setFormState(reduceFormKeysToState(formKeyMap));
  };

  const resetToDefault = () => {
    setFormState(R.mergeDeepRight(reduceFormKeysToState(formKeyMap), defaultStateWithValues));
  };

  const isValidForKey = key =>
    R.complement(isValidTextEntry)(getValueForKey(key)) &&
    !getErrorForKey(key) &&
    !isValidating;

  const getPayload = () =>
    Object.values(formKeyMap).reduce(
      (accumulator, key) => ({
        ...accumulator,
        [key]: getValueForKey(key),
      }),
      {},
    );

  const isOptionalKey = R.flip(R.includes)(optionalKeys);
  const isNotOptionalKey = R.complement(isOptionalKey);

  const isFormValid = () =>
    R.values(formKeyMap)
      .filter(isNotOptionalKey)
      .every(isValidForKey);

  return {
    formState,
    handleValueChange: updateState({
      stateKey: 'value',
    }),
    handleErrorChange: updateState({ stateKey: 'error' }),
    handleDisabledChange: updateState({ stateKey: 'disabled' }),
    isValidating,
    setIsValidatingTrue,
    setIsValidatingFalse,
    toggleFocusKey,
    isFocused,
    getValueForKey,
    getErrorForKey,
    focusListener: formKey => R.partial(toggleFocusKey, [formKey]),
    setFormState,
    reset,
    resetToDefault,
    isValidForKey,
    getErrorMessageForKey,
    setErrorMessageForKey: updateState({ stateKey: 'errorMessage' }),
    isFormValid,
    getPayload,
    getIsDisabledForKey,
  };
};

export default useFormState;
