import React from "react";
import Button from "../core/Button";
import { FaPlus } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { CellGrid } from "../../commons/types";

interface Sheet {
  id: string;
  name: string;
  cells: CellGrid;
  columnWidths: { [key: number]: number };
  rowHeights: { [key: number]: number };
}

interface SheetTabsProps {
  sheets: Sheet[];
  activeSheetId: string;
  editingSheetName: string | null;
  onSwitchToSheet: (sheetId: string) => void;
  onDeleteSheet: (sheetId: string) => void;
  onSheetNameKeyPress: (e: React.KeyboardEvent, sheetId: string) => void;
  onSetEditingSheetName: (sheetId: string | null) => void;
  onAddNewSheet: () => void;
}

const SheetTabs: React.FC<SheetTabsProps> = ({
  sheets,
  activeSheetId,
  editingSheetName,
  onSwitchToSheet,
  onDeleteSheet,
  onSheetNameKeyPress,
  onSetEditingSheetName,
  onAddNewSheet,
}) => {
  return (
    <div className="bg-gray-50 border-t flex items-center">
      <div className="flex-1 flex items-center overflow-x-auto">
        {sheets.map((sheet) => (
          <div
            key={sheet.id}
            className={`relative flex items-center min-w-0 ${
              sheet.id === activeSheetId
                ? "bg-white border-t-2 border-blue-500"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {editingSheetName === sheet.id ? (
              <input
                type="text"
                defaultValue={sheet.name}
                className="px-3 py-2 text-sm bg-transparent border-none outline-none min-w-0"
                onKeyDown={(e) => onSheetNameKeyPress(e, sheet.id)}
                onBlur={() => onSetEditingSheetName(null)}
                autoFocus
              />
            ) : (
              <button
                onClick={() => onSwitchToSheet(sheet.id)}
                onDoubleClick={() => onSetEditingSheetName(sheet.id)}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 min-w-0 truncate"
              >
                {sheet.name}
              </button>
            )}

            {sheets.length > 1 && (
              <Button
                onClick={() => onDeleteSheet(sheet.id)}
                className="border-0 text-red-600"
                title="Eliminar hoja"
              >
                <IoMdClose />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={onAddNewSheet}
        className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 border-l"
        title="Agregar nueva hoja"
      >
        <FaPlus className="inline mr-1 text-blue-600" />
        Agregar SubDiseño
      </Button>
    </div>
  );
};

export default SheetTabs;
