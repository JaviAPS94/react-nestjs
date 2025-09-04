import React from "react";

interface SpreadSheetColumnHeaderProps {
  columnIndex: number;
  columnLabel: string;
  columnWidth: number;
  defaultRowHeight: number;
  onResizeStart: (
    e: React.MouseEvent,
    type: "column" | "row",
    index: number,
    currentSize: number
  ) => void;
}

const SpreadSheetColumnHeader: React.FC<SpreadSheetColumnHeaderProps> = ({
  columnIndex,
  columnLabel,
  columnWidth,
  defaultRowHeight,
  onResizeStart,
}) => {
  return (
    <div
      className="border-r border-gray-300 flex items-center justify-center text-sm font-medium text-gray-700 bg-gray-50 relative group"
      style={{
        width: columnWidth,
        height: defaultRowHeight,
      }}
    >
      {columnLabel}
      {/* Column resize handle */}
      <div
        className="absolute right-0 top-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-400 group-hover:bg-blue-200"
        onMouseDown={(e) =>
          onResizeStart(e, "column", columnIndex, columnWidth)
        }
        title="Arrastrar para redimensionar columna"
      />
    </div>
  );
};

export default SpreadSheetColumnHeader;
