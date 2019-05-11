export const useStateMock = ({ setStateMock } = {}) =>
  jest.fn(initialValue => {
    let _value = initialValue;
    const setStateValue = newValue => {
      _value = newValue;
    };
    return [_value, setStateMock || setStateValue];
  });

export default useStateMock;
