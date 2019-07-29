import * as R from "ramda";
import { throwError } from "@clutch/helpers";

const deepMerge = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();
  !(R.is(Object, target) && R.is(Object, source)) && throwError("deepMerge must be called with objects");

  for (const key in source) {
    if (R.is(Object, source[key])) {
      R.isNil(target[key]) && Object.assign(target, { [key]: {} });
      deepMerge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }

  return deepMerge(target, ...sources);
};

export default deepMerge;