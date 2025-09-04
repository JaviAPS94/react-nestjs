"use client";

import type React from "react";
import { useState } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";

interface CheckboxListItemProps {
  id: unknown;
  label: string;
  additionalInfo: string;
  isChecked: boolean;
  onToggle: (id: unknown) => void;
  isDisabled: boolean;
  children?: React.ReactNode; // Add support for children
}

const CheckboxListItem: React.FC<CheckboxListItemProps> = ({
  id,
  label,
  additionalInfo,
  isChecked,
  onToggle,
  isDisabled,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = Boolean(children);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <li className="my-2">
      <div className="flex items-center">
        {hasChildren && (
          <button
            onClick={toggleExpand}
            className="mr-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <BiChevronDown size={16} />
            ) : (
              <BiChevronRight size={16} />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-6"></div>}

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
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-6 mt-2 border-l-2 border-gray-200 pl-2">
          {children}
        </div>
      )}
    </li>
  );
};

export default CheckboxListItem;
