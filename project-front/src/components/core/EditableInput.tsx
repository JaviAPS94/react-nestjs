import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaCheck,
  FaRegEdit,
  FaRegCheckSquare,
  FaRegCheckCircle,
  FaLock,
  FaLockOpen,
} from "react-icons/fa";
import { GoLock, GoUnlock } from "react-icons/go";

interface EditableInputProps {
  initialValue: string;
  name: string;
  placeholder: string;
  onValueChange: (value: string) => void;
}

const EditableInput: React.FC<EditableInputProps> = ({
  initialValue,
  name,
  placeholder,
  onValueChange,
}) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    onValueChange(value);
  }, [value, onValueChange]);

  const handleEditClick = () => {
    setIsDisabled(!isDisabled);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          className={`block w-full rounded-md border shadow-sm p-3 my-3 pr-20 transition-colors duration-200 ease-in-out
            ${
              isDisabled
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            }`}
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          disabled={isDisabled}
        />
        <div className="absolute right-3 flex items-center space-x-2">
          {isDisabled ? (
            <GoLock className="text-gray-400" />
          ) : (
            <GoUnlock className="text-green-500" />
          )}
          <button
            className={`p-1 rounded-full focus:outline-none
              ${
                isDisabled
                  ? "text-blue-500 hover:text-blue-600"
                  : "text-green-500 hover:text-green-600"
              }`}
            onClick={handleEditClick}
            aria-label={isDisabled ? "Enable editing" : "Save changes"}
          >
            {isDisabled ? (
              <FaRegEdit className="w-5 h-5" />
            ) : (
              <FaRegCheckCircle className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableInput;
