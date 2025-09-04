import classNames from "classnames";
import type React from "react";
import { useState, useEffect, forwardRef } from "react";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, label, checked = false, onCheckedChange, id, ...props },
    ref
  ) => {
    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
      setIsChecked(checked);
    }, [checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newCheckedState = e.target.checked;
      setIsChecked(newCheckedState);
      onCheckedChange?.(newCheckedState);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState);
        onCheckedChange?.(newCheckedState);
      }
    };

    return (
      <div className="flex items-center">
        <div
          className={classNames(
            "relative flex h-5 w-5 items-center justify-center rounded border border-gray-300",
            isChecked ? "bg-emerald-600 border-emerald-600" : "bg-white",
            "transition-colors duration-200 ease-in-out",
            className
          )}
          tabIndex={0}
          role="checkbox"
          aria-checked={isChecked}
          onKeyDown={handleKeyDown}
        >
          {isChecked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <input
            type="checkbox"
            className="absolute opacity-0 h-0 w-0"
            ref={ref}
            checked={isChecked}
            onChange={handleChange}
            id={id}
            {...props}
          />
        </div>
        {label && (
          <label htmlFor={id} className="ml-2 text-sm font-medium">
            {label}
          </label>
        )}
      </div>
    );
  }
);

export default Checkbox;
