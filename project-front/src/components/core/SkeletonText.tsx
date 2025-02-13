import React from "react";

interface SkeletonTextProps {
  lines?: number; // Number of lines for the skeleton
  className?: string; // Additional styles
}

const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-8 bg-gray-300 rounded animate-pulse w-full"
        />
      ))}
    </div>
  );
};

export default SkeletonText;
