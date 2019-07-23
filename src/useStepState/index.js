import { useState, useEffect } from "react";
import { throwError } from '@clutch/helpers';

export const useStepState = ({
    steps = [],
    currentStepIndex = 0,
    useStateDep = useState,
    useEffectDep = useEffect
}) => {
    const [currentStepIndexState, setCurrentStepIndexState] = useStateDep(currentStepIndex);
    const [currentStepState, setCurrentStepState] = useStateDep(steps[currentStepIndex]);

    useEffectDep(() => {
        !!steps[currentStepIndexState] ? 
        setCurrentStepState(steps[currentStepIndexState]) :
        throwError('This step does not exist');
    }, [currentStepIndexState]);

    const nextStep = () => {
        setCurrentStepIndexState(currentStepIndexState + 1);
    }

    const previousStep = () => {
        setCurrentStepIndexState(currentStepIndexState - 1);
    }

    const resetSteps = () => {
        setCurrentStepIndexState(0);
        setCurrentStepState(steps[0]);
    }

    return {
        currentStep: currentStepState,
        nextStep
    }
}

export default useStepState;