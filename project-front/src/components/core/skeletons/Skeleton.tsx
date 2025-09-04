import React from "react";
import classNames from "classnames";

interface SkeletonProps {
  variant?: "text" | "circle" | "rect"; // shape
  width?: string;
  height?: string;
  className?: string;
  count?: number; // number of skeleton blocks
  rounded?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rect",
  width = "100%",
  height = "1rem",
  className = "",
  count = 1,
  rounded = true,
}) => {
  const baseStyle = classNames(
    "bg-gray-300 animate-pulse",
    {
      rounded: rounded,
      "rounded-full": variant === "circle",
    },
    className
  );

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={baseStyle} style={{ width, height }} />
      ))}
    </>
  );
};

export default Skeleton;
