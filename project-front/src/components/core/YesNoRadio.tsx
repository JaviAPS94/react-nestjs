import type React from "react";
import { useState } from "react";

interface YesNoRadioProps {
  label?: string;
  id?: string;
  name?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const YesNoRadio = ({
  label,
  id = "yes-no-radio",
  name = "yes-no-option",
  defaultValue,
  onChange,
  disabled = false,
}: YesNoRadioProps) => {
  const [selected, setSelected] = useState<string>(defaultValue || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </div>
      )}
      <div className="flex gap-4">
        <div className="flex items-center">
          <input
            type="radio"
            id={`${id}-yes`}
            name={name}
            value="yes"
            checked={selected === "yes"}
            onChange={handleChange}
            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
            disabled={disabled}
          />
          <label
            htmlFor={`${id}-yes`}
            className="ml-2 text-sm font-medium cursor-pointer"
          >
            Sí
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id={`${id}-no`}
            name={name}
            value="no"
            checked={selected === "no"}
            onChange={handleChange}
            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
            disabled={disabled}
          />
          <label
            htmlFor={`${id}-no`}
            className="ml-2 text-sm font-medium cursor-pointer"
          >
            No
          </label>
        </div>
      </div>
    </div>
  );
};

export default YesNoRadio;
