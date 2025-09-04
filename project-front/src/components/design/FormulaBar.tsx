import React from "react";
import Button from "../core/Button";
import { FaPlus, FaXmark, FaPenRuler } from "react-icons/fa6";
import { IoLibraryOutline } from "react-icons/io5";

interface FormulaBarProps {
  selectedCell: string;
  currentSheetName: string;
  formulaInput: string;
  isFormulaBuildingMode: boolean;
  isAddingToFormula: boolean;
  rangeSelectionStart: string | null;
  formulaCursorPosition: number;
  formulaInputRef: React.RefObject<HTMLInputElement>;
  onFormulaChange: (value: string) => void;
  onFormulaKeyPress: (e: React.KeyboardEvent) => void;
  onFormulaFocus: () => void;
  onFormulaBlur: () => void;
  updateCursorPosition: () => void;
  onShowFunctionLibrary: () => void;
  onToggleAddingToFormula: () => void;
  onHandleRangeSelection: () => void;
  onExitFormulaBuildingMode: () => void;
}

const FormulaBar: React.FC<FormulaBarProps> = ({
  selectedCell,
  currentSheetName,
  formulaInput,
  isFormulaBuildingMode,
  isAddingToFormula,
  rangeSelectionStart,
  formulaCursorPosition,
  formulaInputRef,
  onFormulaChange,
  onFormulaKeyPress,
  onFormulaFocus,
  onFormulaBlur,
  updateCursorPosition,
  onShowFunctionLibrary,
  onToggleAddingToFormula,
  onHandleRangeSelection,
  onExitFormulaBuildingMode,
}) => {
  return (
    <div className="mt-2 flex items-center gap-4">
      <span className="text-sm font-medium text-gray-600">
        {currentSheetName} - Celda: {selectedCell}
      </span>
      <input
        ref={formulaInputRef}
        type="text"
        value={formulaInput}
        onChange={(e) => onFormulaChange(e.target.value)}
        onClick={updateCursorPosition}
        onKeyUp={updateCursorPosition}
        onSelect={updateCursorPosition}
        onKeyDown={onFormulaKeyPress}
        onFocus={onFormulaFocus}
        onBlur={onFormulaBlur}
        placeholder="Ingrese un valor o una fórmula (e.g., =A1+B1, =QUADRATIC(A1,1,2,3))"
        className={`flex-1 px-3 py-1 border rounded text-sm focus:outline-none focus:ring-2 ${
          isFormulaBuildingMode
            ? "border-blue-500 focus:ring-blue-500 bg-blue-50"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {isFormulaBuildingMode && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-blue-600 font-medium">Modo Formula</span>
          <span className="text-xs text-gray-500">
            Cursor: {formulaCursorPosition}
          </span>
          <Button
            highlight
            onClick={onShowFunctionLibrary}
            className="px-3 py-1 text-xs rounded font-medium"
            icon={<IoLibraryOutline />}
          >
            Funciones
          </Button>
          <Button
            onClick={onToggleAddingToFormula}
            className={"px-3 py-1 text-xs rounded font-medium"}
            success={isAddingToFormula}
            primary={!isAddingToFormula}
            icon={isAddingToFormula ? <FaXmark /> : <FaPlus />}
          >
            {isAddingToFormula
              ? "Haga clic en las celdas para agregar"
              : "Agregar celda"}
          </Button>
          <Button
            onClick={onHandleRangeSelection}
            className={`px-3 py-1 text-xs rounded font-medium`}
            cancel={rangeSelectionStart ? false : true}
            warning={rangeSelectionStart ? true : false}
            icon={<FaPenRuler />}
          >
            {rangeSelectionStart ? `Rango: ${rangeSelectionStart}:?` : "Rango"}
          </Button>
          <Button
            danger
            onClick={onExitFormulaBuildingMode}
            className="px-2 py-1 text-xs"
            icon={<FaXmark />}
          >
            Salir
          </Button>
        </div>
      )}
    </div>
  );
};

export default FormulaBar;
