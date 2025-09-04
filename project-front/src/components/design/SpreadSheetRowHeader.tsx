import React from "react";

interface SpreadSheetRowHeaderProps {
  rowIndex: number;
  rowHeight: number;
  onResizeStart: (
    e: React.MouseEvent,
    type: "column" | "row",
    index: number,
    currentSize: number
  ) => void;
}

const SpreadSheetRowHeader: React.FC<SpreadSheetRowHeaderProps> = ({
  rowIndex,
  rowHeight,
  onResizeStart,
}) => {
  return (
    <div
      className="w-12 border-r border-gray-300 flex items-center justify-center text-sm font-medium text-gray-700 bg-gray-50 relative group"
      style={{ height: rowHeight }}
    >
      {rowIndex + 1}
      {/* Row resize handle */}
      <div
        className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize bg-transparent hover:bg-blue-400 group-hover:bg-blue-200"
        onMouseDown={(e) => onResizeStart(e, "row", rowIndex, rowHeight)}
        title="Arrastrar para redimensionar fila"
      />
    </div>
  );
};

export default SpreadSheetRowHeader;
