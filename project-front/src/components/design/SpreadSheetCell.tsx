import React from "react";

interface Cell {
  value: string;
  formula: string;
  computed: string | number;
}

interface SpreadSheetCellProps {
  cellRef: string;
  cell: Cell | undefined;
  isSelected: boolean;
  isAddingToFormula: boolean;
  rangeSelectionStart: string | null;
  columnWidth: number;
  rowHeight: number;
  onCellClick: (cellRef: string, event?: React.MouseEvent) => void;
}

const SpreadSheetCell: React.FC<SpreadSheetCellProps> = ({
  cellRef,
  cell,
  isSelected,
  isAddingToFormula,
  rangeSelectionStart,
  columnWidth,
  rowHeight,
  onCellClick,
}) => {
  return (
    <div
      className={`border-r border-gray-200 relative cursor-pointer ${
        isSelected
          ? "ring-2 ring-blue-500 bg-blue-50"
          : isAddingToFormula
          ? "hover:bg-green-100 hover:ring-2 hover:ring-green-400"
          : rangeSelectionStart === cellRef
          ? "bg-orange-200 ring-2 ring-orange-500"
          : "hover:bg-gray-50"
      }`}
      style={{
        width: columnWidth,
        height: rowHeight,
      }}
      onClick={(e) => onCellClick(cellRef, e)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className={`w-full h-full px-1 text-sm flex items-center ${
          typeof cell?.computed === "number" ? "justify-end" : "justify-start"
        } bg-transparent select-none overflow-hidden`}
        title={cell?.computed?.toString() || ""}
      >
        <span className="truncate">{cell?.computed?.toString() || ""}</span>
      </div>
      {/* Visual indicator for adding mode */}
      {isAddingToFormula && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full opacity-75"></div>
      )}
    </div>
  );
};

export default SpreadSheetCell;
