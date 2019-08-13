import { useEffect, useRef } from "react";
import { throwError } from "@clutch/helpers";

export const usePreviousState = ({
    value,
    useEffectDep = useEffect,
    useRefDep = useRef
}) => {
    !value && throwError('Value prop is missing')

    const previousStateRef = useRefDep();

    useEffectDep(() => {
        previousStateRef.current = value;
    }, [value]);

    return previousStateRef.current
}

export default usePreviousState;