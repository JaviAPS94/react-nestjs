import { useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

const ValuesList: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: { [key: string]: any } | Record<string, any>[];
}> = ({ values }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayLimit = 3;

  const renderValues = () => {
    if (Array.isArray(values)) {
      return values
        .slice(0, isExpanded ? values.length : displayLimit)
        .map((value, index) => (
          <li key={index} className="text-sm">
            {value.name}: {value.value}
          </li>
        ));
    } else {
      return Object.entries(values)
        .slice(0, isExpanded ? Object.keys(values).length : displayLimit)
        .map(([key, value]) => (
          <li key={key} className="text-sm">
            {key}: {value}
          </li>
        ));
    }
  };

  const totalCount = Array.isArray(values)
    ? values.length
    : Object.keys(values).length;

  return (
    <div>
      <ul className="list-disc list-inside">{renderValues()}</ul>
      {totalCount > displayLimit && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {isExpanded ? (
            <>
              <BiChevronUp className="mr-1 h-4 w-4" />
              Mostrar menos
            </>
          ) : (
            <>
              <BiChevronDown className="mr-1 h-4 w-4" />
              Mostrar {totalCount - displayLimit} más
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ValuesList;
