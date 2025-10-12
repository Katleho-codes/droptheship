import React, { useReducer, ChangeEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// Define constants for limits
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

// Define types
interface CounterState {
    value: number;
}

type CounterAction =
    | { type: "increment" }
    | { type: "decrement" }
    | { type: "set"; payload: number | string };

interface QuantityCounterProps {
    initialValue?: number;
    onChange?: (value: number) => void;
}

// Reducer function for managing state updates
function counterReducer(state: CounterState, action: CounterAction): CounterState {
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

export default function QuantityCounter({
    initialValue = 1,
    onChange,
}: QuantityCounterProps) {
    const [state, dispatch] = useReducer(counterReducer, {
        value: Math.min(Math.max(initialValue, MIN_QUANTITY), MAX_QUANTITY),
    });

    const handleIncrement = () => {
        const newValue = Math.min(state.value + 1, MAX_QUANTITY);
        dispatch({ type: "increment" });
        onChange?.(newValue);
    };

    const handleDecrement = () => {
        const newValue = Math.max(state.value - 1, MIN_QUANTITY);
        dispatch({ type: "decrement" });
        onChange?.(newValue);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = Number(value);
        const clampedValue = Math.min(
            Math.max(isNaN(numericValue) ? MIN_QUANTITY : numericValue, MIN_QUANTITY),
            MAX_QUANTITY
        );
        dispatch({ type: "set", payload: numericValue });
        onChange?.(clampedValue);
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                type="button"
                onClick={handleDecrement}
                disabled={state.value <= MIN_QUANTITY}
                aria-label="Decrease quantity"
            >
                −
            </Button>

            <Input
                type="number"
                min={MIN_QUANTITY}
                max={MAX_QUANTITY}
                value={state.value}
                onChange={handleInputChange}
                className="w-full [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                aria-label="Quantity"
            />

            <Button
                type="button"
                onClick={handleIncrement}
                disabled={state.value >= MAX_QUANTITY}
                aria-label="Increase quantity"
            >
                +
            </Button>
        </div>
    );
}
