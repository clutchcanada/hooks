import useNumberState from "./index";
describe("useNumberState hook", () => {
  it('should initialize to a value of zero', () => {
    let numberState;
    global.testHook(() => {
      numberState = useNumberState();
    });
    expect(numberState.value).toBe(0);
  });

  it('should increment value by one on increment call', () => {
    let numberState;
    global.testHook(() => {
      numberState = useNumberState();
    });
    global.act(() => {
      numberState.increment()

    });
    expect(numberState.value).toBe(1);
  });

  it('should decrement value by one on decrement call', () => {
    let numberState;
    global.testHook(() => {
      numberState = useNumberState();
    });
    global.act(() => {
      numberState.decrement()

    });
    expect(numberState.value).toBe(-1);
  });
  
  it('should set the number value on setValue if given a number', () => {
    let numberState;
    global.testHook(() => {
      numberState = useNumberState();
    });
    global.act(() => {
      numberState.setValue(3)

    });
    expect(numberState.value).toBe(3);
  });

  it('should throw an error on setValue if value is not a number', () => {
    let numberState;
    global.testHook(() => {
      numberState = useNumberState();
    });
    const test = () =>{
      global.act(() => {
        numberState.setValue("hey")
  
      });
    }
    expect(test).toThrow();
  });
});