import React from "react";
import SpreadSheetColumnHeader from "./SpreadSheetColumnHeader";
import SpreadSheetRowHeader from "./SpreadSheetRowHeader";
import SpreadSheetCell from "./SpreadSheetCell";
import { CellGrid } from "../../commons/types";

const COLUMN_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ROWS = 100;
const COLS = 26;
const DEFAULT_ROW_HEIGHT = 32;

interface SpreadSheetGridProps {
  cells: CellGrid;
  selectedCell: string;
  isAddingToFormula: boolean;
  rangeSelectionStart: string | null;
  getColumnWidth: (col: number) => number;
  getRowHeight: (row: number) => number;
  handleCellClick: (cellRef: string, event?: React.MouseEvent) => void;
  handleResizeStart: (
    e: React.MouseEvent,
    type: "column" | "row",
    index: number,
    currentSize: number
  ) => void;
}

const SpreadSheetGrid: React.FC<SpreadSheetGridProps> = ({
  cells,
  selectedCell,
  isAddingToFormula,
  rangeSelectionStart,
  getColumnWidth,
  getRowHeight,
  handleCellClick,
  handleResizeStart,
}) => {
  // Get cell reference (e.g., A1, B2)
  const getCellRef = (row: number, col: number): string => {
    return `${COLUMN_LABELS[col]}${row + 1}`;
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="inline-block min-w-full">
        {/* Column Headers */}
        <div className="flex sticky top-0 bg-gray-50 border-b">
          <div className="w-12 h-8 border-r border-gray-300 bg-gray-100"></div>
          {Array.from({ length: COLS }, (_, col) => (
            <SpreadSheetColumnHeader
              key={col}
              columnIndex={col}
              columnLabel={COLUMN_LABELS[col]}
              columnWidth={getColumnWidth(col)}
              defaultRowHeight={DEFAULT_ROW_HEIGHT}
              onResizeStart={handleResizeStart}
            />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: ROWS }, (_, row) => (
          <div key={row} className="flex border-b border-gray-200">
            {/* Row Header */}
            <SpreadSheetRowHeader
              rowIndex={row}
              rowHeight={getRowHeight(row)}
              onResizeStart={handleResizeStart}
            />

            {/* Cells */}
            {Array.from({ length: COLS }, (_, col) => {
              const cellRef = getCellRef(row, col);
              const cell = cells[cellRef];
              const isSelected = selectedCell === cellRef;

              return (
                <SpreadSheetCell
                  key={col}
                  cellRef={cellRef}
                  cell={cell}
                  isSelected={isSelected}
                  isAddingToFormula={isAddingToFormula}
                  rangeSelectionStart={rangeSelectionStart}
                  columnWidth={getColumnWidth(col)}
                  rowHeight={getRowHeight(row)}
                  onCellClick={handleCellClick}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpreadSheetGrid;
