// Define constants for limits
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 10;

// Define types
interface CounterState {
    value: number;
}

type CounterAction = { type: 'increment' } | { type: 'decrement' } | { type: 'set'; payload: number | string };

interface QuantityCounterProps {
    initialValue?: number;
    onChange?: (value: number) => void;
}
// Reducer function for managing state updates
export function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "increment":
      return { value: Math.min(state.value + 1, MAX_QUANTITY) };
    case "decrement":
      return { value: Math.max(state.value - 1, MIN_QUANTITY) };
    case "set": {
      const numericValue = Number(action.payload);
      const clampedValue = Math.min(
        Math.max(isNaN(numericValue) ? MIN_QUANTITY : numericValue, MIN_QUANTITY),
        MAX_QUANTITY
      );
      return { value: clampedValue };
    }
    default:
      throw new Error(`Unknown action type: ${(action as any).type}`);
  }
}