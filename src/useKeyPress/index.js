import { useEffect } from 'react';
import * as R from "ramda";
import { throwError } from '@clutch/helpers';

import useBooleanState from "../useBooleanState"

const useKeyPress = (targetKey) => {
    if(!R.is(String, targetKey)) {
        throwError('targetKey must be a string!')
    }
    const keyPressedState = useBooleanState();

    const handleKeyDown = ({ key }) => {
        if (key === targetKey) {
            keyPressedState.setTrue();
        }
    }

    const handleKeyUp = ({ key }) => {
        if (key === targetKey) {
            keyPressedState.setFalse();
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return keyPressedState.value;
}

export default useKeyPress;