import type React from "react";
import { FaTimes } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";

interface CustomInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Escribe aquí...",
  className = "",
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        {...props}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <MdOutlineClose size={18} />
        </button>
      )}
    </div>
  );
};

export default CustomInput;
