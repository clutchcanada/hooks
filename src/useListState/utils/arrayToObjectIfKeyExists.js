import * as R from "ramda";
import throwErrorIfKeyIsNil from "./throwErrorIfKeyIsNil";

export default (arrayToConvert) => 
  arrayToConvert.reduce((accumulator, value) => {
    const key = value.key;
    throwErrorIfKeyIsNil(key);
    accumulator[key] = value;
    return accumulator;
  }, {});