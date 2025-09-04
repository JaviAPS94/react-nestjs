import type React from "react";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Button from "../core/Button";
import { IoNewspaperOutline } from "react-icons/io5";
import { FaClipboardList, FaPlus, FaSave } from "react-icons/fa";
import {
  Accessory,
  CellGrid,
  DesignSubtype,
  DesignWithSubDesigns,
  SemiFinishedType,
  SubDesignData,
  Template,
} from "../../commons/types";
import {
  useEvaluateFunctionMutation,
  useSaveDesignWithSubDesignsMutation,
} from "../../store";
import { Modal } from "../core/Modal";
import Stepper from "../core/Stepper";
import Accesories from "../norms/Accesories";
import SemiFinished from "../norms/SemiFinished";

// Import new components
import FormulaBar from "./FormulaBar";
import SpreadSheetGrid from "./SpreadSheetGrid";
import SheetTabs from "./SheetTabs";
import FunctionLibraryModal from "./FunctionLibraryModal";
import TemplateLibraryModal from "./TemplateLibraryModal";
import { CustomFunction } from "./spreadsheet-types";

interface Sheet {
  id: string;
  name: string;
  cells: CellGrid;
  columnWidths: { [key: number]: number };
  rowHeights: { [key: number]: number };
}

const ROWS = 100;
const COLS = 26;
const COLUMN_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DEFAULT_COLUMN_WIDTH = 96;
const DEFAULT_ROW_HEIGHT = 32;
const MIN_COLUMN_WIDTH = 60;
const MIN_ROW_HEIGHT = 24;

interface SpreadSheetProps {
  subTypeWithFunctions: DesignSubtype;
  templates: Template[];
  elementIds: number[];
  designSubtypeId: number | null;
}

const SpreadSheet = ({
  subTypeWithFunctions,
  templates,
  elementIds,
  designSubtypeId,
}: SpreadSheetProps) => {
  const [sheets, setSheets] = useState<Sheet[]>([
    {
      id: "sheet1",
      name: "SubDiseño1",
      cells: {},
      columnWidths: {},
      rowHeights: {},
    },
  ]);
  const [activeSheetId, setActiveSheetId] = useState<string>("sheet1");
  const [selectedCell, setSelectedCell] = useState<string>("A1");
  const [formulaInput, setFormulaInput] = useState<string>("");
  const [isFormulaBuildingMode, setIsFormulaBuildingMode] =
    useState<boolean>(false);
  const [isAddingToFormula, setIsAddingToFormula] = useState<boolean>(false);
  const [formulaCursorPosition, setFormulaCursorPosition] = useState<number>(0);
  const [rangeSelectionStart, setRangeSelectionStart] = useState<string | null>(
    null
  );
  const [isFormulaInputFocused, setIsFormulaInputFocused] =
    useState<boolean>(false);
  const [editingSheetName, setEditingSheetName] = useState<string | null>(null);
  // Resize state
  const [isResizing, setIsResizing] = useState<{
    type: "column" | "row" | null;
    index: number;
    startPos: number;
    startSize: number;
  }>({ type: null, index: -1, startPos: 0, startSize: 0 });

  // Pagination and search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTermTemplate, setSearchTermTemplate] = useState<string>("");
  const [currentPageTemplate, setCurrentPageTemplate] = useState<number>(1);
  const [functionsPerPage] = useState<number>(5); // Show 6 functions per page

  const [showFunctionLibrary, setShowFunctionLibrary] =
    useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [accessoryModalIsOpen, setAccessoryModalIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedSemiFinished, setSelectedSemiFinished] =
    useState<SemiFinishedType>();
  const [accessoriesData, setAccessoriesData] = useState<Accessory[]>([]);
  const [selectedSubItems, setSelectedSubItems] = useState<number[]>([]);
  const [evaluateFunction] = useEvaluateFunctionMutation();
  const [saveDesignWithSubDesigns] = useSaveDesignWithSubDesignsMutation();

  // Template state
  const [showTemplateLibrary, setShowTemplateLibrary] =
    useState<boolean>(false);

  const formulaInputRef = useRef<HTMLInputElement>(null);

  // Get current sheet
  const currentSheet = sheets.find((sheet) => sheet.id === activeSheetId);
  const cells = currentSheet?.cells || {};
  const columnWidths = currentSheet?.columnWidths || {};
  const rowHeights = currentSheet?.rowHeights || {};

  // Get column width
  const getColumnWidth = (col: number): number => {
    return columnWidths[col] || DEFAULT_COLUMN_WIDTH;
  };

  // Get row height
  const getRowHeight = (row: number): number => {
    return rowHeights[row] || DEFAULT_ROW_HEIGHT;
  };

  // Get cell reference (e.g., A1, B2)
  const getCellRef = (row: number, col: number): string => {
    return `${COLUMN_LABELS[col]}${row + 1}`;
  };

  // Parse cell reference to row/col
  const parseCellRef = (ref: string): { row: number; col: number } | null => {
    const match = ref.match(/^([A-Z])(\d+)$/);
    if (!match) return null;
    const col = COLUMN_LABELS.indexOf(match[1]);
    const row = Number.parseInt(match[2]) - 1;
    return { row, col };
  };

  // Navigate to adjacent cell
  const navigateCell = (direction: "up" | "down" | "left" | "right") => {
    const currentPos = parseCellRef(selectedCell);
    if (!currentPos) return;

    let newRow = currentPos.row;
    let newCol = currentPos.col;

    switch (direction) {
      case "up":
        newRow = Math.max(0, currentPos.row - 1);
        break;
      case "down":
        newRow = Math.min(ROWS - 1, currentPos.row + 1);
        break;
      case "left":
        newCol = Math.max(0, currentPos.col - 1);
        break;
      case "right":
        newCol = Math.min(COLS - 1, currentPos.col + 1);
        break;
    }

    const newCellRef = getCellRef(newRow, newCol);
    selectCell(newCellRef);
  };

  // Select a cell (used for navigation)
  const selectCell = (cellRef: string) => {
    setSelectedCell(cellRef);
    const cell = cells[cellRef];
    const cellFormula = cell?.formula || "";
    setFormulaInput(cellFormula);
    setFormulaCursorPosition(cellFormula.length);
    setIsFormulaBuildingMode(cellFormula.startsWith("="));
    setRangeSelectionStart(null);
    setIsAddingToFormula(false);
  };

  // Handle resize start
  const handleResizeStart = (
    e: React.MouseEvent,
    type: "column" | "row",
    index: number,
    currentSize: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing({
      type,
      index,
      startPos: type === "column" ? e.clientX : e.clientY,
      startSize: currentSize,
    });
  };

  // Handle resize during mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing.type === null) return;

      const currentPos = isResizing.type === "column" ? e.clientX : e.clientY;
      const delta = currentPos - isResizing.startPos;
      const newSize = Math.max(
        isResizing.type === "column" ? MIN_COLUMN_WIDTH : MIN_ROW_HEIGHT,
        isResizing.startSize + delta
      );

      setSheets((prevSheets) =>
        prevSheets.map((sheet) => {
          if (sheet.id === activeSheetId) {
            if (isResizing.type === "column") {
              return {
                ...sheet,
                columnWidths: {
                  ...sheet.columnWidths,
                  [isResizing.index]: newSize,
                },
              };
            } else {
              return {
                ...sheet,
                rowHeights: {
                  ...sheet.rowHeights,
                  [isResizing.index]: newSize,
                },
              };
            }
          }
          return sheet;
        })
      );
    };

    const handleMouseUp = () => {
      setIsResizing({ type: null, index: -1, startPos: 0, startSize: 0 });
    };

    if (isResizing.type !== null) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, activeSheetId]);

  // Handle global keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle navigation when formula input is not focused
      if (
        !isFormulaInputFocused &&
        !isAddingToFormula &&
        !editingSheetName &&
        !showFunctionLibrary &&
        !showTemplateLibrary
      ) {
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            navigateCell("up");
            break;
          case "ArrowDown":
            e.preventDefault();
            navigateCell("down");
            break;
          case "ArrowLeft":
            e.preventDefault();
            navigateCell("left");
            break;
          case "ArrowRight":
            e.preventDefault();
            navigateCell("right");
            break;
          case "Enter":
            e.preventDefault();
            navigateCell("down");
            break;
          case "Tab":
            e.preventDefault();
            navigateCell("right");
            break;
          case "F2":
            e.preventDefault();
            startEditing();
            break;
          case "Delete":
          case "Backspace":
            e.preventDefault();
            // Clear cell content
            setFormulaInput("");
            updateCell(selectedCell, "");
            break;
          default:
            // If user types a regular character, start editing
            if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
              e.preventDefault();
              setFormulaInput(e.key);
              updateCell(selectedCell, e.key);
              startEditing();
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedCell,
    isFormulaInputFocused,
    isAddingToFormula,
    formulaInput,
    editingSheetName,
    showFunctionLibrary,
    showTemplateLibrary,
  ]);

  // Update cursor position from input
  const updateCursorPosition = () => {
    if (formulaInputRef.current) {
      setFormulaCursorPosition(formulaInputRef.current.selectionStart || 0);
    }
  };

  // Set cursor position in input
  const setCursorPosition = (position: number) => {
    if (formulaInputRef.current) {
      formulaInputRef.current.setSelectionRange(position, position);
      formulaInputRef.current.focus();
      setFormulaCursorPosition(position);
    }
  };

  // Function library state
  const customFunctions = useMemo(
    () =>
      subTypeWithFunctions.designFunctions?.map((func) => {
        return {
          id: func.id,
          name: func.name,
          code: func.code,
          formula: func.expression,
          variables: func.variables.split(",").map((v) => v.trim()),
          description: func.description || "",
        };
      }) || [],
    [subTypeWithFunctions.designFunctions]
  );

  // Evaluate custom function
  const evaluateCustomFunction = useCallback(
    async (
      funcName: string,
      args: string[],
      cellGrid: CellGrid
    ): Promise<number | string> => {
      const func = customFunctions.find((f) => f.code === funcName);
      if (!func) return "#FUNCTION_NOT_FOUND";

      if (args.length === 0) {
        return "#MISSING_ARGS";
      }

      try {
        // Parse arguments and replace with actual values
        const values: { [key: string]: number } = {};

        for (let i = 0; i < func.variables.length && i < args.length; i++) {
          const arg = args[i].trim();
          if (!arg) {
            return "#MISSING_ARGUMENT";
          }

          let value: number;

          // Check if argument is a cell reference
          if (/^[A-Z]\d+$/.test(arg)) {
            const cell = cellGrid[arg];
            value = typeof cell?.computed === "number" ? cell.computed : 0;
          } else {
            value = Number.parseFloat(arg);
            if (isNaN(value)) return "#INVALID_ARGUMENT";
          }

          values[func.variables[i]] = value;
        }

        if (Object.keys(values).length !== func.variables.length) {
          return "#MISSING_ARGS";
        }

        const resultData = await evaluateFunction({
          functions: [
            {
              designFunctionId: Number(func.id),
              parameters: values,
            },
          ],
        }).unwrap();

        const resultValue = resultData.results[0]?.result;

        return Number(resultValue);
      } catch {
        return "#ERROR";
      }
    },
    [customFunctions, evaluateFunction]
  );

  // Evaluate formula
  const evaluateFormula = useCallback(
    async (
      formula: string,
      cellGrid: CellGrid
    ): Promise<number | string | undefined> => {
      if (!formula || formula.trim() === "") {
        return "";
      }

      if (!formula.startsWith("=")) {
        const num = Number.parseFloat(formula);
        return isNaN(num) ? formula : num;
      }

      let expression = formula.slice(1).trim(); // Remove '=' and trim

      if (!expression) {
        return "#ERROR";
      }

      try {
        // Handle custom functions first (before replacing cell references)
        for (const func of customFunctions) {
          const funcRegex = new RegExp(`${func.code}\\(([^)]*)\\)`, "g");

          // Use a more sophisticated approach for async replacements
          const matches = expression.match(funcRegex);
          if (matches) {
            for (const match of matches) {
              const argsStr = match.substring(
                func.code.length + 1,
                match.length - 1
              );
              if (!argsStr.trim()) {
                expression = expression.replace(match, "#MISSING_ARGS");
                continue;
              }

              const args = argsStr
                .split(",")
                .map((arg: string) => arg.trim())
                .filter((arg: unknown) => arg !== "");

              if (args.length === 0) {
                expression = expression.replace(match, "#MISSING_ARGS");
                continue;
              }

              // Now properly await the async result
              const result = await evaluateCustomFunction(
                func.code,
                args,
                cellGrid
              );
              return result;
            }
          }
        }

        // Rest of the function remains the same
        // ...existing code...
        // Handle basic functions
        expression = expression.replace(/SUM$$([^)]*)$$/g, (_, range) => {
          if (!range.trim()) {
            return "0";
          }
          const refs = range
            .split(",")
            .map((ref: string) => ref.trim())
            .filter((ref: unknown) => ref !== "");
          let sum = 0;
          refs.forEach((ref: string) => {
            if (ref.includes(":")) {
              // Range like A1:A5
              const [start, end] = ref.split(":");
              const startPos = parseCellRef(start.trim());
              const endPos = parseCellRef(end.trim());
              if (startPos && endPos) {
                for (let r = startPos.row; r <= endPos.row; r++) {
                  for (let c = startPos.col; c <= endPos.col; c++) {
                    const cellRef = getCellRef(r, c);
                    const cell = cellGrid[cellRef];
                    if (cell && typeof cell.computed === "number") {
                      sum += cell.computed;
                    }
                  }
                }
              }
            } else {
              const cell = cellGrid[ref];
              if (cell && typeof cell.computed === "number") {
                sum += cell.computed;
              }
            }
          });
          return sum.toString();
        });

        expression = expression.replace(/AVERAGE$$([^)]*)$$/g, (_, range) => {
          if (!range.trim()) {
            return "0";
          }
          const refs = range
            .split(",")
            .map((ref: string) => ref.trim())
            .filter((ref: unknown) => ref !== "");
          let sum = 0;
          let count = 0;
          refs.forEach((ref: string) => {
            if (ref.includes(":")) {
              const [start, end] = ref.split(":");
              const startPos = parseCellRef(start.trim());
              const endPos = parseCellRef(end.trim());
              if (startPos && endPos) {
                for (let r = startPos.row; r <= endPos.row; r++) {
                  for (let c = startPos.col; c <= endPos.col; c++) {
                    const cellRef = getCellRef(r, c);
                    const cell = cellGrid[cellRef];
                    if (cell && typeof cell.computed === "number") {
                      sum += cell.computed;
                      count++;
                    }
                  }
                }
              }
            } else {
              const cell = cellGrid[ref];
              if (cell && typeof cell.computed === "number") {
                sum += cell.computed;
                count++;
              }
            }
          });
          return count > 0 ? (sum / count).toString() : "0";
        });

        // Replace cell references with their values
        expression = expression.replace(/[A-Z]\d+/g, (match) => {
          const cell = cellGrid[match];
          if (cell && typeof cell.computed === "number") {
            return cell.computed.toString();
          }
          return "0";
        });

        // Handle power operator (^) - convert to Math.pow
        expression = expression.replace(
          /(\d+(?:\.\d+)?|$$[^)]+$$)\s*\^\s*(\d+(?:\.\d+)?|$$[^)]+$$)/g,
          (_, base, exponent) => `Math.pow(${base}, ${exponent})`
        );

        // Check if expression is empty or invalid after processing
        if (!expression.trim() || expression.trim() === "()") {
          return "#ERROR";
        }

        // Basic math evaluation
        const result = Function(`"use strict"; return (${expression})`)();
        return typeof result === "number" && !isNaN(result) ? result : "#ERROR";
      } catch (error) {
        console.error("Error evaluating formula:", error);
        return "#ERROR";
      }
    },
    [customFunctions, evaluateCustomFunction]
  );

  // Helper function to find all cells that reference a given cell
  const findDependentCells = useCallback(
    (targetCell: string, cells: CellGrid): string[] => {
      const dependents: string[] = [];

      Object.keys(cells).forEach((cellRef) => {
        const cell = cells[cellRef];
        if (cell?.formula && cell.formula.startsWith("=")) {
          // Check if this cell's formula references the target cell
          const cellRefRegex = new RegExp(`\\b${targetCell}\\b`, "g");
          if (cellRefRegex.test(cell.formula)) {
            dependents.push(cellRef);
          }
        }
      });

      return dependents;
    },
    []
  );

  // Helper function to get all cells that need to be recalculated (including nested dependencies)
  const getDependencyChain = useCallback(
    (changedCell: string, cells: CellGrid): string[] => {
      const toRecalculate = new Set<string>();
      const queue = [changedCell];
      const processed = new Set<string>();

      while (queue.length > 0) {
        const currentCell = queue.shift()!;
        if (processed.has(currentCell)) continue;

        processed.add(currentCell);
        toRecalculate.add(currentCell);

        // Find cells that depend on the current cell
        const dependents = findDependentCells(currentCell, cells);
        dependents.forEach((dependent) => {
          if (!processed.has(dependent)) {
            queue.push(dependent);
          }
        });
      }

      return Array.from(toRecalculate);
    },
    [findDependentCells]
  );

  // Update cell value in current sheet
  const updateCell = useCallback(
    (cellRef: string, value: string) => {
      // First update the cell with its new value
      setSheets((prevSheets) => {
        const updatedSheets = prevSheets.map((sheet) => {
          if (sheet.id === activeSheetId) {
            const newCells = { ...sheet.cells };

            // Create a new cell object or update existing one properly
            newCells[cellRef] = {
              value: value,
              formula: value,
              computed: value, // Set initial computed value
            };

            return { ...sheet, cells: newCells };
          }
          return sheet;
        });

        // After the update, calculate only dependent cells
        const recalculateDependentCells = async () => {
          const currentSheet = updatedSheets.find(
            (sheet) => sheet.id === activeSheetId
          );
          if (!currentSheet) return;

          const newCells = { ...currentSheet.cells };

          // Get all cells that need to be recalculated
          const cellsToRecalculate = getDependencyChain(cellRef, newCells);
          const updatedComputedValues: Record<string, string | number> = {};

          // Sort cells to handle dependencies in correct order
          // Simple approach: process the changed cell first, then others
          const sortedCells = [
            cellRef,
            ...cellsToRecalculate.filter((ref) => ref !== cellRef),
          ];

          // Process each cell that needs recalculation
          for (const ref of sortedCells) {
            if (!newCells[ref]) continue;

            try {
              const result = await evaluateFormula(
                newCells[ref].formula,
                newCells
              );
              updatedComputedValues[ref] = result !== undefined ? result : "";

              // Update the cell grid with the new computed value for next cell calculations
              newCells[ref] = {
                ...newCells[ref],
                computed: updatedComputedValues[ref],
              };
            } catch (error) {
              console.error(`Error calculating cell ${ref}:`, error);
              updatedComputedValues[ref] = "#ERROR";
              newCells[ref] = {
                ...newCells[ref],
                computed: "#ERROR",
              };
            }
          }

          // Apply all the computed values at once
          setSheets((latestSheets) =>
            latestSheets.map((sheet) => {
              if (sheet.id === activeSheetId) {
                const updatedCellsWithComputed = { ...sheet.cells };

                // Update computed values only for cells that were recalculated
                Object.keys(updatedComputedValues).forEach((ref) => {
                  if (updatedCellsWithComputed[ref]) {
                    updatedCellsWithComputed[ref] = {
                      ...updatedCellsWithComputed[ref],
                      computed: updatedComputedValues[ref],
                    };
                  }
                });

                return { ...sheet, cells: updatedCellsWithComputed };
              }
              return sheet;
            })
          );
        };

        // Run the recalculation immediately
        recalculateDependentCells();

        return updatedSheets;
      });
    },
    [evaluateFormula, activeSheetId, getDependencyChain]
  );

  // Insert text at cursor position
  const insertAtCursor = (textToInsert: string) => {
    const currentPosition = formulaCursorPosition;
    const newFormula =
      formulaInput.slice(0, currentPosition) +
      textToInsert +
      formulaInput.slice(currentPosition);

    setFormulaInput(newFormula);
    updateCell(selectedCell, newFormula);

    // Set cursor position after the inserted text
    const newPosition = currentPosition + textToInsert.length;
    setTimeout(() => {
      setCursorPosition(newPosition);
    }, 0);
  };

  // Insert function into formula
  const insertFunction = (func: CustomFunction) => {
    const functionCall = `${func.code}(${func.variables.join(", ")})`;
    insertAtCursor(functionCall);
    setShowFunctionLibrary(false);
  };

  // Handle cell click
  const handleCellClick = (cellRef: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (isFormulaBuildingMode && isAddingToFormula) {
      // Adding cell reference to formula - DON'T change selected cell
      if (rangeSelectionStart && rangeSelectionStart !== cellRef) {
        // Complete range selection
        const rangeRef = `${rangeSelectionStart}:${cellRef}`;
        insertAtCursor(rangeRef);
        setRangeSelectionStart(null);
        setIsAddingToFormula(false);
      } else {
        // Add single cell reference
        insertAtCursor(cellRef);
        setIsAddingToFormula(false);
      }

      // Keep focus on formula input and don't change selected cell
      setTimeout(() => {
        if (formulaInputRef.current) {
          formulaInputRef.current.focus();
        }
      }, 0);
    } else {
      // Normal cell selection - just select, don't focus formula input
      selectCell(cellRef);
    }
  };

  // Start editing the selected cell
  const startEditing = () => {
    if (formulaInputRef.current) {
      formulaInputRef.current.focus();
      formulaInputRef.current.setSelectionRange(
        formulaInput.length,
        formulaInput.length
      );
    }
  };

  // Handle formula input change
  const handleFormulaChange = (value: string) => {
    setFormulaInput(value);
    updateCursorPosition();

    // Check if we're in formula mode
    const isFormula = value.startsWith("=");
    setIsFormulaBuildingMode(isFormula);

    if (!isFormula) {
      setRangeSelectionStart(null);
      setIsAddingToFormula(false);
    }

    updateCell(selectedCell, value);
  };

  // Toggle adding to formula mode
  const toggleAddingToFormula = () => {
    updateCursorPosition(); // Make sure we have the latest cursor position
    setIsAddingToFormula(!isAddingToFormula);
    setRangeSelectionStart(null);
  };

  // Handle range selection
  const handleRangeSelection = () => {
    updateCursorPosition(); // Make sure we have the latest cursor position
    if (rangeSelectionStart) {
      setRangeSelectionStart(null);
    } else {
      setRangeSelectionStart(selectedCell);
      setIsAddingToFormula(true);
    }
  };

  // Exit formula building mode
  const exitFormulaBuildingMode = () => {
    setIsFormulaBuildingMode(false);
    setRangeSelectionStart(null);
    setIsAddingToFormula(false);
    updateCell(selectedCell, formulaInput);
  };

  // Handle key press in formula input
  const handleFormulaKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      formulaInputRef.current?.blur();
      exitFormulaBuildingMode();
      navigateCell("down"); // Move to next row after Enter
    } else if (e.key === "Escape") {
      e.preventDefault();
      formulaInputRef.current?.blur();
      exitFormulaBuildingMode();
    } else if (e.key === "Tab") {
      e.preventDefault();
      exitFormulaBuildingMode();
      navigateCell("right"); // Move to next column after Tab
    }
  };

  // Add new sheet
  const addNewSheet = () => {
    const newSheetNumber = sheets.length + 1;
    const newSheet: Sheet = {
      id: `sheet${Date.now()}`,
      name: `SubDiseño${newSheetNumber}`,
      cells: {},
      columnWidths: {},
      rowHeights: {},
    };
    setSheets((prev) => [...prev, newSheet]);
    setActiveSheetId(newSheet.id);
    setSelectedCell("A1");
    setFormulaInput("");
  };

  // Switch to sheet
  const switchToSheet = (sheetId: string) => {
    setActiveSheetId(sheetId);
    setSelectedCell("A1");
    setFormulaInput("");
    setIsFormulaBuildingMode(false);
    setIsAddingToFormula(false);
    setRangeSelectionStart(null);
  };

  // Delete sheet
  const deleteSheet = (sheetId: string) => {
    if (sheets.length <= 1) return; // Don't delete the last sheet

    setSheets((prev) => prev.filter((sheet) => sheet.id !== sheetId));

    // If we deleted the active sheet, switch to the first remaining sheet
    if (activeSheetId === sheetId) {
      const remainingSheets = sheets.filter((sheet) => sheet.id !== sheetId);
      if (remainingSheets.length > 0) {
        switchToSheet(remainingSheets[0].id);
      }
    }
  };

  // Rename sheet
  const renameSheet = (sheetId: string, newName: string) => {
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === sheetId ? { ...sheet, name: newName } : sheet
      )
    );
    setEditingSheetName(null);
  };

  // Handle sheet name edit
  const handleSheetNameKeyPress = (e: React.KeyboardEvent, sheetId: string) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      renameSheet(sheetId, target.value);
    } else if (e.key === "Escape") {
      setEditingSheetName(null);
    }
  };

  const toogleAccessoryModal = () =>
    setAccessoryModalIsOpen(!accessoryModalIsOpen);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleAddAccesory = () => {
    toogleAccessoryModal();
    setStep(0);
    setSelectedSemiFinished(undefined);
  };

  const handleCancel = () => {
    setSelectedSemiFinished(undefined);
    toogleAccessoryModal();
    setStep(0);
  };

  // Load template into current sheet
  const loadTemplate = useCallback(
    (template: Template) => {
      setSheets((prevSheets) => {
        const updatedSheets = prevSheets.map((sheet) => {
          if (sheet.id === activeSheetId) {
            return {
              ...sheet,
              name: template.name,
              cells: { ...template.cells },
              columnWidths: { ...template.cellsStyles.columnWidths },
              rowHeights: { ...template.cellsStyles.rowHeights },
            };
          }
          return sheet;
        });

        // After loading template, recalculate all formulas
        const recalculateAllTemplateFormulas = async () => {
          const currentSheet = updatedSheets.find(
            (sheet) => sheet.id === activeSheetId
          );
          if (!currentSheet) return;

          const newCells = { ...currentSheet.cells };
          const updatedComputedValues: Record<string, string | number> = {};

          // Process all cells to recalculate formulas
          for (const ref of Object.keys(newCells)) {
            try {
              const result = await evaluateFormula(
                newCells[ref].formula,
                newCells
              );
              updatedComputedValues[ref] = result !== undefined ? result : "";

              // Update the cell grid with the new computed value for next cell calculations
              newCells[ref] = {
                ...newCells[ref],
                computed: updatedComputedValues[ref],
              };
            } catch (error) {
              console.error(`Error calculating cell ${ref}:`, error);
              updatedComputedValues[ref] = "#ERROR";
              newCells[ref] = {
                ...newCells[ref],
                computed: "#ERROR",
              };
            }
          }

          // Apply all the computed values at once
          setSheets((latestSheets) =>
            latestSheets.map((sheet) => {
              if (sheet.id === activeSheetId) {
                const updatedCellsWithComputed = { ...sheet.cells };

                // Update computed values for all cells
                Object.keys(updatedComputedValues).forEach((ref) => {
                  if (updatedCellsWithComputed[ref]) {
                    updatedCellsWithComputed[ref] = {
                      ...updatedCellsWithComputed[ref],
                      computed: updatedComputedValues[ref],
                    };
                  }
                });

                return { ...sheet, cells: updatedCellsWithComputed };
              }
              return sheet;
            })
          );
        };

        // Run the recalculation immediately after loading template
        recalculateAllTemplateFormulas();

        return updatedSheets;
      });

      setShowTemplateLibrary(false);
      setSelectedCell("A1");
      setFormulaInput("");
    },
    [activeSheetId, evaluateFormula]
  );

  useEffect(() => {
    if (templates.length === 1) {
      const initialTemplate = templates[0];
      loadTemplate(initialTemplate);
    }
  }, [templates, loadTemplate]);

  const stepComponents: Record<
    number,
    { title?: string; content: JSX.Element; isFinalStep?: boolean }
  > = {
    0: {
      title: "Selecciona los accesorios",
      content: (
        <Accesories
          accessoriesData={accessoriesData}
          setAccessoriesData={setAccessoriesData}
          selectedSubItems={selectedSubItems}
          setSelectedSubItems={setSelectedSubItems}
        />
      ),
      isFinalStep: false,
    },
    1: {
      title: "Selecciona el semi elaborado",
      content: (
        <SemiFinished setSelectedSemiFinished={setSelectedSemiFinished} />
      ),
      isFinalStep: true,
    },
  };

  const handleSaveDesignWithSubDesigns = async () => {
    const subDesignData: SubDesignData[] = sheets.map((sheet) => {
      return {
        name: sheet.name,
        code: sheet.id,
        data: sheet as unknown as Record<string, unknown>,
      };
    });

    if (!designSubtypeId) {
      return;
    }

    const designData: DesignWithSubDesigns = {
      name: "Nuevo diseño",
      code: "DESIGN_" + Date.now(),
      elements: elementIds,
      designSubtypeId: designSubtypeId,
      subDesigns: subDesignData,
    };

    await saveDesignWithSubDesigns(designData);
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-100 border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Calculos de diseño
          </h1>
          <div className="flex items-center gap-2">
            <Button
              success
              onClick={toogleAccessoryModal}
              className="px-4 py-2 rounded-md"
              icon={<FaPlus />}
            >
              Agregar accesorio
            </Button>
            <Button
              highlight
              onClick={() => setShowInstructions(true)}
              className="px-4 py-2 rounded font-medium"
              icon={<IoNewspaperOutline />}
            >
              Instrucciones de uso
            </Button>
            {templates.length > 1 && (
              <Button
                info
                onClick={() => setShowTemplateLibrary(true)}
                className="px-4 py-2 rounded font-medium"
                icon={<FaClipboardList />}
              >
                Plantillas
              </Button>
            )}
            <Button
              primary
              onClick={() => handleSaveDesignWithSubDesigns()}
              className="px-4 py-2 rounded font-medium"
              icon={<FaSave />}
            >
              Guardar
            </Button>
          </div>
        </div>
        <FormulaBar
          selectedCell={selectedCell}
          currentSheetName={currentSheet?.name || ""}
          formulaInput={formulaInput}
          isFormulaBuildingMode={isFormulaBuildingMode}
          isAddingToFormula={isAddingToFormula}
          rangeSelectionStart={rangeSelectionStart}
          formulaCursorPosition={formulaCursorPosition}
          formulaInputRef={formulaInputRef}
          onFormulaChange={handleFormulaChange}
          onFormulaKeyPress={handleFormulaKeyPress}
          onFormulaFocus={() => setIsFormulaInputFocused(true)}
          onFormulaBlur={() => setIsFormulaInputFocused(false)}
          updateCursorPosition={updateCursorPosition}
          onShowFunctionLibrary={() => setShowFunctionLibrary(true)}
          onToggleAddingToFormula={toggleAddingToFormula}
          onHandleRangeSelection={handleRangeSelection}
          onExitFormulaBuildingMode={exitFormulaBuildingMode}
        />
      </div>

      {/* Function Library Modal */}
      <FunctionLibraryModal
        isOpen={showFunctionLibrary}
        customFunctions={customFunctions}
        searchTerm={searchTerm}
        currentPage={currentPage}
        functionsPerPage={functionsPerPage}
        onClose={() => setShowFunctionLibrary(false)}
        onSearchChange={setSearchTerm}
        onPageChange={setCurrentPage}
        onInsertFunction={insertFunction}
      />

      <TemplateLibraryModal
        isOpen={showTemplateLibrary}
        onClose={() => setShowTemplateLibrary(false)}
        templates={templates}
        onLoadTemplate={loadTemplate}
        onSearchChange={setSearchTermTemplate}
        onPageChange={setCurrentPageTemplate}
        searchTerm={searchTermTemplate}
        currentPage={currentPageTemplate}
      />

      {/* Spreadsheet Grid */}
      <SpreadSheetGrid
        cells={cells}
        selectedCell={selectedCell}
        isAddingToFormula={isAddingToFormula}
        rangeSelectionStart={rangeSelectionStart}
        getColumnWidth={getColumnWidth}
        getRowHeight={getRowHeight}
        handleCellClick={handleCellClick}
        handleResizeStart={handleResizeStart}
      />

      {/* Sheet Tabs */}
      <SheetTabs
        sheets={sheets}
        activeSheetId={activeSheetId}
        editingSheetName={editingSheetName}
        onSwitchToSheet={switchToSheet}
        onDeleteSheet={deleteSheet}
        onSheetNameKeyPress={handleSheetNameKeyPress}
        onSetEditingSheetName={setEditingSheetName}
        onAddNewSheet={addNewSheet}
      />

      {/* Function Reference */}
      <Modal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="Instrucciones de uso"
        size="lg"
      >
        <div className="text-sm text-gray-600 space-y-1">
          <div>
            <strong>Navegación:</strong> Teclas de flecha (↑↓←→), Tecla Enter
            (abajo), Tecla Tab (derecha)
          </div>
          <div>
            <strong>Funciones personalizadas:</strong> QUADRATIC(x,a,b,c),
            LINEAR(x,m,b), EXPONENTIAL(x,a,b), etc.
          </div>
          <div>
            <strong>Funciones básicas:</strong> SUM(A1:A5), AVERAGE(A1:A5)
          </div>
          <div>
            <strong>Operaciones básicas:</strong> +, -, *, /, (), ^
          </div>
          <div>
            <strong>Ejemplo:</strong> =QUADRATIC(A1,1,2,3) calcula x² + 2x + 3
            donde x = A1
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={accessoryModalIsOpen}
        onClose={toogleAccessoryModal}
        title="Agregar accesorio"
        size="xl"
      >
        <Stepper
          step={step}
          stepComponents={stepComponents}
          onNextStep={handleNextStep}
          onFinalAction={handleAddAccesory}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default SpreadSheet;
