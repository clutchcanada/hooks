import * as R from "ramda";
import throwErrorIfKeyIsNil from "./throwErrorIfKeyIsNil";

export default (arrayToConvert, uniqueKey) => 
  arrayToConvert.reduce((hashMap, value) => {
    const key = value[uniqueKey];
    throwErrorIfKeyIsNil(key);
    hashMap.set(key, value);
    return hashMap;
  }, new Map());