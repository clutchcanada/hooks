import { useState } from 'react';
import * as R from 'ramda';
import { useBooleanState, useAccordionState } from '../index';
import { isValidTextEntry, reduceFormKeysToState } from "./utils";

const useFormState = ({
  formKeyMap = {},
  defaultValues = {},
  optionalKeys = [],
  useStateDep = useState,
} = {}) => {
  const {
    value: isValidating,
    setTrue: setIsValidatingTrue,
    setFalse: setIsValidatingFalse,
  } = useBooleanState({ useStateDep });
  const [formState, setFormState] = useStateDep({
    ...reduceFormKeysToState(formKeyMap),
    ...defaultValues,
  });

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
    isValidForKey,
    getErrorMessageForKey,
    setErrorMessageForKey: updateState({ stateKey: 'errorMessage' }),
    isFormValid,
    getPayload,
    getIsDisabledForKey,
  };
};

export default useFormState;
