import useStepState from './index';

describe('useStepState Hook', () => {
    const setStateMock = jest.fn();
    const useStateMock = global.useStateMock({ setStateMock });

    beforeEach(() => {
        setStateMock.mockClear();
        useStateMock.mockClear();
    });

    describe('Initialisation', () => {
        const steps = ['step1', 'step2'];

        it('should return the first step by default via the step state prop', () => {
            const { currentStep } = useStepState({
              steps,
              useStateDep: useStateMock,
              useEffectDep: (fn) => fn(),
            });
      
            expect(currentStep).toEqual(steps[0]);
          });
          
          it('should return the correct step if you try to go to a step that exists', () => {
              const { currentStep, nextStep } = useStepState({
                steps,
                initialStepIndex: 1,     
                useStateDep: useStateMock,
                useEffectDep: (fn) => fn(),
              });
      
              expect(currentStep).toEqual(steps[1]);
          });

          it('should throw an error if you try to go to a step that doesnt exist', () => {
            const test = () => {
              const { currentStep, nextStep } = useStepState({
                steps,
                initialStepIndex: 5,            
                useStateDep: useStateMock,
                useEffectDep: (fn) => fn(),
              });
            };
      
            expect(test).toThrowError();
          });
    });

    describe('nextStep', () => {
      const steps = ['step1', 'step2'];

      it('should call setState with nextStep when nextStep is called', () => {
          const { currentStep, nextStep } = useStepState({
            steps,
            useStateDep: useStateMock,
            useEffectDep: (fn) => fn(),
          });
          nextStep();
          const setStateCallResult = setStateMock.mock.calls[1][0](0);
          expect(setStateCallResult).toEqual(1);
        });
       
  });

    describe('previousStep', () => {
      const steps = ['step1', 'step2', 'step3'];

      it('should call setState with nextStep when previousStep is called', () => {
        const { currentStep, previousStep } = useStepState({
          steps,
          initialStepIndex: 2,
          useStateDep: useStateMock,
          useEffectDep: (fn) => fn(),
        });
        previousStep();
        const setStateCallResult = setStateMock.mock.calls[1][0](2);
        expect(setStateCallResult).toEqual(1);
      });
     
  });

  describe('resetSteps', () => {
    const steps = ['step1', 'step2', 'step3'];

    it('should reset steps to 0 when resetSteps is called', () => {
      const { currentStep, resetSteps } = useStepState({
        steps,
        initialStepIndex: 2,
        useStateDep: useStateMock,
        useEffectDep: (fn) => fn(),
      });
      resetSteps();
      const setStateCallResult = setStateMock.mock.calls[1][0];
      expect(setStateCallResult).toEqual(0);
    });
   
  });
});