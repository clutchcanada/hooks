import { useEffect, useRef } from "react";
import * as R from "ramda";
import { throwError } from "@clutch/helpers";

export const usePreviousState = ({
    value,
    useEffectDep = useEffect,
    useRefDep = useRef
}) => {
    R.isNil(value) && throwError('value prop is missing');

    const previousStateRef = useRefDep();

    useEffectDep(() => {
        previousStateRef.current = value;
    }, [value]);

    return previousStateRef.current
}

export default usePreviousState;