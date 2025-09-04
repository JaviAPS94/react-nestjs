import { useState, useEffect, useRef } from "react";
import { FaAngleDown } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";

export interface Option<T> {
  label: string;
  value: T;
}

interface Props<T> {
  options: Option<T>[] | undefined;
  selectedValue: T | null | undefined;
  onChange: (value: T | undefined) => void;
  isLoading: boolean;
  placeholder?: string;
  error?: Record<string, string>;
  errorKey?: string;
  searchPlaceholder?: string;
  filterOptions?: (
    options: Option<T>[] | undefined,
    searchTerm: string
  ) => Option<T>[] | undefined;
  disabled?: boolean;
  className?: string;
}

const Select = <T,>({
  options,
  selectedValue,
  onChange,
  isLoading,
  error,
  errorKey,
  placeholder = "Selecciona una opción...",
  filterOptions = defaultFilterOptions,
  disabled = false,
  className,
}: Props<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<
    Option<T>[] | undefined
  >(options);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Filter options based on search term
  useEffect(() => {
    setFilteredOptions(filterOptions(options, searchTerm));
  }, [searchTerm, options, filterOptions]);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (value: T) => {
    if (disabled) return;
    onChange(value);
    setSearchTerm(""); // Clear search term after selection
    setIsDropdownOpen(false); // Close dropdown
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = e.target.value;
    setSearchTerm(value);
    onChange(undefined); // Clear selected value when search term is changed

    if (value === "") {
      setIsDropdownOpen(true); // Keep dropdown open when search term is cleared
    }
  };

  const handleInputFocus = () => {
    if (disabled) return;
    setIsDropdownOpen(true); // Open dropdown on focus
  };

  const handleClearSearch = () => {
    if (disabled) return;
    setSearchTerm("");
    onChange(undefined); // Clear selected value when search term is cleared
  };

  const selectClassName = `flex items-center border rounded-md shadow-sm ${
    disabled ? "bg-gray-200 cursor-not-allowed" : ""
  } ${className}`;

  return (
    <div className="mt-4 relative">
      <div className={selectClassName}>
        <input
          ref={inputRef}
          type="text"
          className={`block w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 ${
            disabled
              ? "bg-gray-200 cursor-not-allowed text-gray-500"
              : "focus:ring-blue-500"
          }`}
          placeholder={isLoading ? "Cargando..." : placeholder}
          value={
            searchTerm ||
            (selectedValue
              ? options?.find((opt) => opt.value === selectedValue)?.label
              : "")
          }
          onChange={handleInputChange}
          onFocus={handleInputFocus} // Open dropdown when input is clicked
          disabled={isLoading || disabled}
        />
        {(searchTerm || selectedValue) && !disabled && (
          <MdOutlineClose
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
            onClick={handleClearSearch}
          />
        )}
        {!disabled && (
          <FaAngleDown
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
            onClick={handleInputFocus}
          />
        )}
      </div>
      {isDropdownOpen && !disabled && (
        <div
          ref={dropdownRef}
          className={`absolute mt-1 w-full max-h-60 overflow-y-auto border rounded-md shadow-lg ${
            error && errorKey && error[errorKey]
              ? "border-red-500"
              : "border-gray-300"
          } bg-white z-20`}
          style={{ top: "100%", left: 0 }}
        >
          {isLoading ? (
            <p className="text-sm text-gray-500 p-2">Cargando...</p>
          ) : filteredOptions?.length === 0 ? (
            <p className="text-sm text-gray-500 p-2">No hay resultados</p>
          ) : (
            filteredOptions?.map((option) => (
              <div
                key={`${option.value}`}
                onClick={() => handleOptionSelect(option.value)}
                className={`cursor-pointer p-2 hover:bg-blue-100 ${
                  option.value === selectedValue ? "bg-blue-200" : ""
                }`}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}

      {error && errorKey && error[errorKey] && (
        <span className="text-red-500 text-sm">{error[errorKey]}</span>
      )}
    </div>
  );
};

// Default filter function
const defaultFilterOptions = <T,>(
  options: Option<T>[] | undefined,
  searchTerm: string
): Option<T>[] | undefined => {
  if (!searchTerm) return options;
  return options?.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export default Select;
