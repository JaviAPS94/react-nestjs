import React from "react";
import classNames from "classnames";

interface SkeletonBoxProps {
  className?: string;
}

const SkeletonBox: React.FC<SkeletonBoxProps> = ({ className }) => (
  <div className={classNames("bg-gray-300 rounded animate-pulse", className)} />
);

const FilterSkeleton: React.FC = () => {
  return (
    <div className="flex justify-between justify-items-center align-middle min-w-[70rem] mb-5">
      {/* Country select */}
      <SkeletonBox className="w-[10rem] h-10 mt-4" />

      {/* Name input */}
      <SkeletonBox className="w-[12rem] h-10 mt-4" />

      {/* SAP Reference input */}
      <SkeletonBox className="w-[12rem] h-10 mt-4" />

      {/* Subtype select */}
      <SkeletonBox className="w-[10rem] h-10 mt-4" />

      {/* Search Button */}
      <SkeletonBox className="w-[8rem] h-10 mt-4" />

      {/* Clear Filters Button */}
      <SkeletonBox className="w-[10rem] h-10 mt-4" />
    </div>
  );
};

export default FilterSkeleton;
