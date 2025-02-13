import type React from "react";
import { useState, useEffect, useRef, type ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "right" | "bottom" | "left";
  delay?: number;
}

const TooltipGeneral: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  delay = 400,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        aria-describedby="tooltip"
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`absolute z-10 px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow-sm transition-opacity duration-300 ${positionClasses[position]}`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-blue-500 transform rotate-45 ${
              position === "top"
                ? "bottom-[-4px] left-1/2 -translate-x-1/2"
                : position === "right"
                ? "left-[-4px] top-1/2 -translate-y-1/2"
                : position === "bottom"
                ? "top-[-4px] left-1/2 -translate-x-1/2"
                : "right-[-4px] top-1/2 -translate-y-1/2"
            }`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default TooltipGeneral;
