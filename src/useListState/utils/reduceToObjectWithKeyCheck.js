import throwErrorIfKeyIsNil from "./throwErrorIfKeyIsNil";

export default (accumulator, value) => {
  const key = value.key;
  throwErrorIfKeyIsNil(key);
  accumulator[key] = value;
  return accumulator;
};