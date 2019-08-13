import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { mount } from 'enzyme';

import usePreviousState from "./index";

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

const PreviousStateComponent = () => {
    const [count, setCount] = useState(0);
    const prevCount = usePreviousState({
        value: count
    });

    return (
        <div>
            <h1>{prevCount}</h1>
            <h2>{count}</h2>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

describe("usePreviousState", () => {
    it('should initialize current and previous state correctly', () => {
        ReactTestUtils.act(() => {
            ReactDOM.render(<PreviousStateComponent />, container)
        });

        expect(container.querySelector("h1").textContent).toBe("");
        expect(container.querySelector("h2").textContent).toBe("0");
    });
    it('should update previous state and current state correctly', () => {
        ReactTestUtils.act(() => {
            ReactDOM.render(<PreviousStateComponent />, container)
        });

        const button = container.querySelector("button");

        act(() => {
            button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });

        expect(container.querySelector("h1").textContent).toBe("0");
        expect(container.querySelector("h2").textContent).toBe("1");
    });
    it('should throw an error if no value is present', () => {
        const result = () => usePreviousState({
            value: null,
        });
        expect(result).toThrowError();
    });
});