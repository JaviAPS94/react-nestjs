import React from "react";

interface CheckboxListItemProps {
  id: number;
  label: string;
  additionalInfo: string; // Dynamic field for extra info
  isChecked: boolean;
  onToggle: (id: number) => void;
  isDisabled: boolean;
}

const CheckboxListItem: React.FC<CheckboxListItemProps> = ({
  id,
  label,
  additionalInfo,
  isChecked,
  onToggle,
  isDisabled,
}) => (
  <li className="flex items-center my-2">
    <input
      type="checkbox"
      id={`checkbox-${id}`}
      checked={isChecked}
      onChange={() => onToggle(id)}
      className="mr-2 rounded text-blue-500 focus:ring-blue-500"
      disabled={isDisabled}
    />
    <label
      htmlFor={`checkbox-${id}`}
      className="text-sm cursor-pointer flex items-center justify-between w-full"
    >
      <span>{label}</span>
      <span className="text-xs text-gray-500">{additionalInfo}</span>
    </label>
  </li>
);

export default CheckboxListItem;
