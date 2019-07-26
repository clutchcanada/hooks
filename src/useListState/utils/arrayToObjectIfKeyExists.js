import * as R from "ramda";
import throwErrorIfKeyIsNil from "./throwErrorIfKeyIsNil";

export default (arrayToConvert, uniqueKey) => 
  arrayToConvert.reduce((accumulator, value) => {
    const key = value[uniqueKey];
    throwErrorIfKeyIsNil(key);
    accumulator[key] = value;
    return accumulator;
  }, {});