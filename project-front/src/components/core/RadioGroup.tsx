import React from "react";

export interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  name: string;
  selectedValue?: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  name,
  selectedValue,
  onChange,
}) => {
  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <div className="flex flex-row space-x-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => handleChange(option.value)}
            className="form-radio text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
