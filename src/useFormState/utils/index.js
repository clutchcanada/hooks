import * as R from "ramda";

export const isValidTextEntry = R.anyPass([R.isNil, R.equals('')]);
export const reduceFormKeysToState = R.pipe(
  R.values,
  R.reduce(
    (accum, value) => ({
      ...accum,
      [value]: {
        value: '',
        error: false,
        errorMessage: '',
        disabled: false,
      },
    }),
    {},
  ),
);