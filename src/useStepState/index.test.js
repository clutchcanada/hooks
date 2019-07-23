import useStepState from './index';

describe('useStepState Hook', () => {
    const setStateMock = jest.fn();
    const useStateMock = global.useStateMock({ setStateMock });

    beforeEach(() => {
        setStateMock.mockClear();
        useStateMock.mockClear();
    });

    describe('Initialisation', () => {
        it('should return the first step by default via the step state prop', () => {
            const steps = ['step1', 'step2'];
            const { currentStep } = useStepState({
              steps,
              useStateDep: useStateMock,
              useEffectDep: (fn) => fn(),
            });
      
            expect(currentStep).toEqual(steps[0]);
          });
    });
});