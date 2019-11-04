import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { mount } from 'enzyme';

import usePromiseWithLoadingState from "./index";

const createMockPromise = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("resolved");
        }, 500)
    })
}

const createMockPromiseWithReject = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("error");
        }, 500)
    })
}

describe("usePromiseWithLoadingState", () => {
    it('Should throw error is no promise is specified', () => {
       const test = () => {
            usePromiseWithLoadingState();
       }
        expect(test).toThrowError();
    });

    it('Resolved promise should return expected resolved value from wrapped promise', async(done) => {
        let promiseWithLoadingState;
        global.testHook(() => {
            promiseWithLoadingState = usePromiseWithLoadingState(createMockPromise());
          });

          const resolvedPromise = await promiseWithLoadingState.promise;
          expect(resolvedPromise).toBe('resolved');
          done();
     });

     it('Should return true for the loading state upon initialization', () => {
        let promiseWithLoadingState;
        global.testHook(() => {
            promiseWithLoadingState = usePromiseWithLoadingState(createMockPromise());
          });
          expect(promiseWithLoadingState.isLoading).toBe(true);
     });

     it('Should return false for the loading once the loading state is resolved', async (done) => {
        let promiseWithLoadingState;
        global.testHook(() => {
            promiseWithLoadingState = usePromiseWithLoadingState(createMockPromise());
          });

          await promiseWithLoadingState.promise;
          expect(promiseWithLoadingState.isLoading).toBe(false);
          done();
     });

     it('Reject promise should return expected rejected value from wrapped promise', async (done) => {
        let promiseWithLoadingState;
        global.testHook(() => {
            promiseWithLoadingState = usePromiseWithLoadingState(createMockPromiseWithReject());
          });

          await expect(promiseWithLoadingState.promise).rejects.toBe("error");
          done();
     });

     it('Should return true for the loading state upon initialization of a rejected promise', () => {
        let promiseWithLoadingState;
        global.testHook(() => {
            promiseWithLoadingState = usePromiseWithLoadingState(createMockPromiseWithReject());
          });

        expect(promiseWithLoadingState.isLoading).toBe(true);
     });

     it('Should return false for the loading state once promise is rejected', async (done) => {
        let promiseWithLoadingState;

        const rejectedPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject("error");
            }, 300)
        })

        global.testHook(() => {
            promiseWithLoadingState = usePromiseWithLoadingState(rejectedPromise);
          });

          await expect(promiseWithLoadingState.promise).rejects.toBe("error");
            expect(promiseWithLoadingState.isLoading).toBe(false);
             done();
     });
});