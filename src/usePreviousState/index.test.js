import usePreviousState from "./index";

describe("usePreviousState", () => {
    it('should return the value of the value passed', () => {
        const value = "test"
        const mockUseEffect = jest.fn();
        const mockUseRef = () => {
            return {
                current: value
            }
        }
        const result = usePreviousState({
            value: "test",
            useEffectDep: mockUseEffect,
            useRefDep: mockUseRef
        });
        expect(result).toBe("test")
    });
    it('should throw an error if no value is present', () => {
        const value = ""
        const mockUseEffect = jest.fn();
        const mockUseRef = (value) => {
            return {
                current: value
            }
        }
        const result = () => usePreviousState({
            value: null,
            useEffectDep: mockUseEffect,
            useRefDep: mockUseRef
        });
        expect(result).toThrowError();
    });
});