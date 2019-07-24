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
});