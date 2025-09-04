import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import classNames from "classnames";

interface NoDataProps {
  message?: string;
  className?: string;
}

const NoData: React.FC<NoDataProps> = ({
  message = "No data available",
  className,
}) => {
  return (
    <div
      className={classNames(
        "flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-inner",
        className
      )}
    >
      <div className="bg-primary/10 p-6 rounded-full mb-4 flex items-center justify-center">
        <FaRegQuestionCircle className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oops!</h2>
      <p className="text-gray-600 text-center max-w-sm">{message}</p>
    </div>
  );
};

export default NoData;
