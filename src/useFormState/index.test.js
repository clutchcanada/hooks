import useFormState from "./index";

const EXAMPLE_FORM_KEY_MAP = {
  EMAIL: "email",
  PASSWORD: "password"
}
describe('useFormState hook', () => {
  
  describe("formState", () => {
    it('should setup the correct state for the formKeyMap', () => {
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock(),
      });

      const expectedObject = {
        email: {
          value: '',
          error: false,
          errorMessage: '',
          disabled: false,
        },
        password: {
          value: '',
          error: false,
          errorMessage: '',
          disabled: false,
        }
      };

      expect(formState.formState).toMatchObject(expectedObject);
    });

    it('should include any set default values', () => {
      let formState;
      global.testHook(() => {
        formState = useFormState({
          formKeyMap: EXAMPLE_FORM_KEY_MAP,
          defaultValues: {
            [EXAMPLE_FORM_KEY_MAP.EMAIL]: "test@test.com"
          }
        });
      });
      expect(formState.getValueForKey(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe("test@test.com");
      expect(formState.getValueForKey(EXAMPLE_FORM_KEY_MAP.PASSWORD)).toBe("");
    });

    it('should include any default state', () => {
      let formState;
      global.testHook(() => {
        formState = useFormState({
          formKeyMap: EXAMPLE_FORM_KEY_MAP,
          defaultState: {
            [EXAMPLE_FORM_KEY_MAP.EMAIL]: {
              value:"test@test.com",
              disabled: true,
            }
          }
        });
      });
      expect(formState.getValueForKey(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe("test@test.com");
      expect(formState.getIsDisabledForKey(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe(true);
      expect(formState.getErrorForKey(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe(false);
      expect(formState.getErrorMessageForKey(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe("");
      expect(formState.getValueForKey(EXAMPLE_FORM_KEY_MAP.PASSWORD)).toBe("");
    });

    it('should prioritize default values over default state', () => {
      let formState;
      global.testHook(() => {
        formState = useFormState({
          formKeyMap: EXAMPLE_FORM_KEY_MAP,
          defaultValues: {
            [EXAMPLE_FORM_KEY_MAP.EMAIL]: "test@test.com"
          },
          defaultState: {
            [EXAMPLE_FORM_KEY_MAP.EMAIL]: {
              value:"a@test.com",
              disabled: true,
            }
          }
        });
      });
      expect(formState.getValueForKey(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe("test@test.com");
      expect(formState.getIsDisabledForKey(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe(true);
    });
  });

  describe("handleValueChange", () => {
    it('should call setState with existing object but a new value for the key given', () => {
      const setStateMock = jest.fn();
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock({ setStateMock }),
      });
      setStateMock.mockClear();
      formState.handleValueChange(EXAMPLE_FORM_KEY_MAP.EMAIL, "craig.pullar@clutch.ca");
      const expectedObject = {
        email: {
          value: 'craig.pullar@clutch.ca',
          error: false,
          errorMessage: '',
          disabled: false,
        },
        password: {
          value: '',
          error: false,
          errorMessage: '',
          disabled: false,
        }
      };
      const receivedState = setStateMock.mock.calls[0][0](formState.formState);
      expect(receivedState).toMatchObject(expectedObject);
    });
  });

  describe("handleErrorChange", () => {
    it('should call setState with existing object but a new value for the error key given', () => {
      const setStateMock = jest.fn();
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock({ setStateMock }),
      });
      setStateMock.mockClear();
      formState.handleErrorChange(EXAMPLE_FORM_KEY_MAP.EMAIL, true);
      const expectedObject = {
        email: {
          value: '',
          error: true,
          errorMessage: '',
          disabled: false,
        },
        password: {
          value: '',
          error: false,
          errorMessage: '',
          disabled: false,
        }
      };
      const receivedState = setStateMock.mock.calls[0][0](formState.formState);
      expect(receivedState).toMatchObject(expectedObject);
    });
  });

  describe("handleDisabledChange", () => {
    it('should call setState with existing object but a new value for the error key given', () => {
      const setStateMock = jest.fn();
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock({ setStateMock }),
      });
      setStateMock.mockClear();
      formState.handleDisabledChange(EXAMPLE_FORM_KEY_MAP.EMAIL, true);
      const expectedObject = {
        email: {
          value: '',
          error: false,
          errorMessage: '',
          disabled: true,
        },
        password: {
          value: '',
          error: false,
          errorMessage: '',
          disabled: false,
        }
      };
      const receivedState = setStateMock.mock.calls[0][0](formState.formState);
      expect(receivedState).toMatchObject(expectedObject);
    });
  });

  describe("setErrorMessageForKey", () => {
    it('should call setState with existing object but a new value for the errorMessage key given', () => {
      const setStateMock = jest.fn();
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock({ setStateMock }),
      });
      setStateMock.mockClear();
      formState.setErrorMessageForKey(EXAMPLE_FORM_KEY_MAP.EMAIL, "oooo not so much");
      const expectedObject = {
        email: {
          value: '',
          error: false,
          errorMessage: 'oooo not so much',
          disabled: false,
        },
        password: {
          value: '',
          error: false,
          errorMessage: '',
          disabled: false,
        }
      };
      const receivedState = setStateMock.mock.calls[0][0](formState.formState);
      expect(receivedState).toMatchObject(expectedObject);
    });
  });

  describe("isFormValid", ()=> {
    it('should return false if any of the keys are not valid', () => {
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock(),
        defaultState: {
          [EXAMPLE_FORM_KEY_MAP.EMAIL]: {
            value: "teddy.westside@clutch.ca",
            error: false,
            disabled: true,
            errorMessage: ''
          },
          [EXAMPLE_FORM_KEY_MAP.PASSWORD]: {
            value: "",
            error: false,
            disabled: true,
            errorMessage: ''
          }
        }
      });
      expect(formState.isFormValid()).toBe(false)
    });

    it('should return true if all of the keys are valid', () => {
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock(),
        defaultState: {
          [EXAMPLE_FORM_KEY_MAP.EMAIL]: {
            value: "teddy.westside@clutch.ca",
            error: false,
            disabled: true,
            errorMessage: ''
          },
          [EXAMPLE_FORM_KEY_MAP.PASSWORD]: {
            value: "dsfsd",
            error: false,
            disabled: true,
            errorMessage: ''
          }
        }
      });

      expect(formState.isFormValid()).toBe(true)
    });
    
    it('should exclude optional keys from this check', () => {
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock(),
        defaultState: {
          [EXAMPLE_FORM_KEY_MAP.EMAIL]: {
            value: "teddy.westside@clutch.ca",
            error: false,
            disabled: true,
            errorMessage: ''
          },
          [EXAMPLE_FORM_KEY_MAP.PASSWORD]: {
            value: "",
            error: false,
            disabled: true,
            errorMessage: ''
          }
        },
        optionalKeys: [EXAMPLE_FORM_KEY_MAP.PASSWORD]
      });

      expect(formState.isFormValid()).toBe(true)
    });
  });

    describe("getValueForKey", () => {
      it('should get the value for the key given', () => {
        const formState = useFormState({
          formKeyMap: EXAMPLE_FORM_KEY_MAP,
          useStateDep: global.useStateMock(),
          defaultState: {
            [EXAMPLE_FORM_KEY_MAP.EMAIL]: {
              value: "teddy.westside@clutch.ca",
              error: false,
              disabled: false,
              errorMessage: ''
            }
          }
        });
  
        expect(formState.getValueForKey(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe("teddy.westside@clutch.ca");
      });
    });

  describe("getErrorForKey", () => {
    it('should get the error value for the key given', () => {
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock(),
        defaultState: {
          [EXAMPLE_FORM_KEY_MAP.EMAIL]: {
            value: "teddy.westside@clutch.ca",
            error: true,
            disabled: false,
            errorMessage: ''
          }
        }
      });

      expect(formState.getErrorForKey(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe(true);
    });
  });

  describe("getIsDisabledForKey", () => {
    it('should get the isDisabled value for the key given', () => {
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock(),
        defaultState: {
          [EXAMPLE_FORM_KEY_MAP.EMAIL]: {
            value: "teddy.westside@clutch.ca",
            error: false,
            disabled: true,
            errorMessage: ''
          }
        }
      });

      expect(formState.getIsDisabledForKey(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe(true);
    });
  });

  describe("getErrorMessageForKey", () => {
    it('should get the errorMessage value for the key given', () => {
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock(),
        defaultState: {
          [EXAMPLE_FORM_KEY_MAP.EMAIL]: {
            value: "teddy.westside@clutch.ca",
            error: false,
            disabled: true,
            errorMessage: 'Mate, you got issues'
          }
        }
      });

      expect(formState.getErrorMessageForKey(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe('Mate, you got issues');
    });
  });

  describe("setFormState", () => {
    it('should call setState with whatever value is passed to it', () => {
      const setStateMock = jest.fn();
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock({ setStateMock }),
      });
      setStateMock.mockClear();

      formState.setFormState("heyy buddy");
      expect(setStateMock).toBeCalledWith("heyy buddy");
    }); 
  });

  describe("isValidForKey", () => {
    it('should return false if error is true', () => {
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock(),
        defaultState: {
          [EXAMPLE_FORM_KEY_MAP.EMAIL]: {
            value: "teddy.westside@clutch.ca",
            error: true,
            disabled: true,
            errorMessage: ''
          }
        }
      });

      expect(formState.isValidForKey(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe(false);
    });

    it('should return false if value is empty string', () => {
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock(),
        defaultState: {
          [EXAMPLE_FORM_KEY_MAP.EMAIL]: {
            value: "",
            error: false,
            disabled: true,
            errorMessage: ''
          }
        }
      });

      expect(formState.isValidForKey(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe(false);
    });

    it('should return true if value has length and error is false', () => {
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock(),
        defaultState: {
          [EXAMPLE_FORM_KEY_MAP.EMAIL]: {
            value: "Talk to me, talk to me, oh baby",
            error: false,
            disabled: true,
            errorMessage: ''
          }
        }
      });

      expect(formState.isValidForKey(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe(true);
    });
  });

  describe("reset", () => {
    it('should call setState with the reset the form key values', () => {
      const setStateMock = jest.fn();

      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock({ setStateMock }),
        defaultState: {
          [EXAMPLE_FORM_KEY_MAP.EMAIL]: {
            value: "Talk to me, talk to me, oh baby",
            error: true,
            disabled: true,
            errorMessage: 'yolo'
          }
        }
      });
      setStateMock.mockClear();
      const expectedObject = {
        email: {
          value: '',
          error: false,
          errorMessage: '',
          disabled: false,
        },
        password: {
          value: '',
          error: false,
          errorMessage: '',
          disabled: false,
        }
      };
      formState.reset();
      expect(setStateMock).toBeCalledWith(expectedObject);
    });
  });

  describe("isValidating", () => {
    it('should initialize to false', () => {
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock(),
      });

      expect(formState.isValidating).toBe(false);
    });
    
  });

  describe("setIsValidatingTrue", () => {

    it('should call setState with true', () => {
      const setStateMock = jest.fn();
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock({ setStateMock }),
      });
      setStateMock.mockClear();
      formState.setIsValidatingTrue();
      expect(setStateMock).toBeCalledWith(true);
    });
  });

  describe("setIsValidatingFalse", () => {
    it('should call setState with false', () => {
      const setStateMock = jest.fn();
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock({ setStateMock }),
      });
      setStateMock.mockClear();
      formState.setIsValidatingFalse();
      expect(setStateMock).toBeCalledWith(false);
    });
  });

  describe("getPayload", () => {
    it('should return the key and values object', () => {
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock(),
        defaultState: {
          [EXAMPLE_FORM_KEY_MAP.EMAIL]: {
            value: "Talk to me, talk to me, oh baby",
            error: true,
            disabled: true,
            errorMessage: 'yolo'
          }
        }
      });

      const receivedPayload = formState.getPayload();
      const expectedPayload = {
        [EXAMPLE_FORM_KEY_MAP.EMAIL]: "Talk to me, talk to me, oh baby",
        [EXAMPLE_FORM_KEY_MAP.PASSWORD]: ''
      };

      expect(receivedPayload).toMatchObject(expectedPayload);
    });
  });

  describe("toggleFocusKey", () => {
    it('should call set state with the key given', () => {
      const setStateMock = jest.fn();
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock({ setStateMock }),
      });

      setStateMock.mockClear();
      formState.toggleFocusKey(EXAMPLE_FORM_KEY_MAP.EMAIL);

      expect(setStateMock).toBeCalledWith(EXAMPLE_FORM_KEY_MAP.EMAIL);
    });
  });

  describe("isFocused", () => {
    it('should return true if key is focused', () => {
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock(),
      });

      expect(formState.isFocused("NO_ACTIVE_KEY")).toBe(true);
    });

    it('should return false if key is not focused', () => {
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock(),
      });

      expect(formState.isFocused(EXAMPLE_FORM_KEY_MAP.EMAIL)).toBe(false);
    });
  });

  describe('focusListener', () => {
    it('should create a bound version of toggleFocusKey', () => {
      const setStateMock = jest.fn();
      const formState = useFormState({
        formKeyMap: EXAMPLE_FORM_KEY_MAP,
        useStateDep: global.useStateMock({ setStateMock }),
      });

      const boundFocusListener = formState.focusListener(EXAMPLE_FORM_KEY_MAP.EMAIL);
      setStateMock.mockClear();
      boundFocusListener();
      expect(setStateMock).toBeCalledWith(EXAMPLE_FORM_KEY_MAP.EMAIL);
    });
    
  });
  
  
});
