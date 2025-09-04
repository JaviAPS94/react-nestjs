import { useState, useEffect, useRef } from "react";
import {
  FaCalculator,
  FaDownload,
  FaSync,
  FaSearch,
  FaTimes,
  FaPlus,
  FaSave,
  FaFileAlt,
  FaTrash,
  FaPencilAlt,
  FaCheck,
} from "react-icons/fa";
import { DesignFunction, DesignSubtype } from "../../commons/types";
import { useEvaluateFunctionMutation } from "../../store";
import Button from "../core/Button";
import FunctionsGraph from "./FunctionsGraph";

interface SheetData {
  id: string;
  name: string;
  designTypeId: number;
  designTypeName: string;
  designFunctions: DesignFunction[];
}

interface ProgramCalculationsProps {
  subTypeWithFunctions: DesignSubtype;
}

const ProgramCalculations: React.FC<ProgramCalculationsProps> = ({
  subTypeWithFunctions,
}) => {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState<string>("");
  const [newSheetDialog, setNewSheetDialog] = useState(false);
  const [newSheetName, setNewSheetName] = useState("");
  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [editingSheetName, setEditingSheetName] = useState("");

  const [evaluateFunction] = useEvaluateFunctionMutation();

  useEffect(() => {
    const initialData = [
      {
        id: "sheet-1",
        name: "Hoja 1",
        designTypeId: subTypeWithFunctions.designTypeId,
        designTypeName: subTypeWithFunctions.designTypeName,
        designFunctions: subTypeWithFunctions.designFunctions || [],
      },
    ];

    setSheets(initialData);
    setActiveSheet(initialData[0]?.id || "sheet-1");
  }, [subTypeWithFunctions]);

  const [variableValues, setVariableValues] = useState<
    Record<string, Record<string, Record<string, number>>>
  >({});
  const [results, setResults] = useState<
    Record<string, Record<string, number | string>>
  >({});
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {}
  );

  const [allVariablesBySheet, setAllVariablesBySheet] = useState<
    Record<string, string[]>
  >({});
  const [visibleVariablesBySheet, setVisibleVariablesBySheet] = useState<
    Record<string, string[]>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFunctions, setFilteredFunctions] = useState<DesignFunction[]>(
    []
  );
  const [scopeBySheetAndFunction, setScopeBySheetAndFunction] = useState<
    Record<string, Record<number, Record<string, number>>>
  >({});

  const modalRef = useRef<HTMLDivElement>(null);

  const currentSheet =
    sheets.find((sheet) => sheet.id === activeSheet) || sheets[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        newSheetDialog &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setNewSheetDialog(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [newSheetDialog]);

  useEffect(() => {
    const variablesBySheet: Record<string, string[]> = {};

    sheets.forEach((sheet) => {
      const variables = new Set<string>();
      sheet.designFunctions.forEach((func) => {
        func.variables.split(",").forEach((v) => variables.add(v.trim()));
      });
      variablesBySheet[sheet.id] = Array.from(variables);
    });

    setAllVariablesBySheet(variablesBySheet);

    setVisibleVariablesBySheet((prev) => {
      const newVisibleVars = { ...prev };
      Object.keys(variablesBySheet).forEach((sheetId) => {
        if (!newVisibleVars[sheetId]) {
          newVisibleVars[sheetId] = variablesBySheet[sheetId];
        }
      });
      return newVisibleVars;
    });
  }, [sheets]);

  useEffect(() => {
    if (!searchTerm || !currentSheet) {
      setFilteredFunctions(currentSheet?.designFunctions || []);
      return;
    }

    const filtered = currentSheet.designFunctions.filter(
      (func) =>
        func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        func.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
        func.variables.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFunctions(filtered);
  }, [searchTerm, currentSheet]);

  useEffect(() => {
    setFilteredFunctions(currentSheet?.designFunctions || []);
    setSearchTerm("");
  }, [activeSheet, currentSheet]);

  const initializeSheetState = (sheetId: string) => {
    setVariableValues((prev) => ({
      ...prev,
      [sheetId]: {},
    }));

    setResults((prev) => ({
      ...prev,
      [sheetId]: {},
    }));

    setErrors((prev) => ({
      ...prev,
      [sheetId]: {},
    }));
  };

  const handleInputChange = (
    sheetId: string,
    functionId: number,
    variable: string,
    value: string
  ) => {
    const numValue = Number.parseFloat(value);

    setVariableValues((prev) => ({
      ...prev,
      [sheetId]: {
        ...(prev[sheetId] || {}),
        [functionId]: {
          ...(prev[sheetId]?.[functionId] || {}),
          [variable]: isNaN(numValue) ? 0 : numValue,
        },
      },
    }));

    if (errors[sheetId]?.[functionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[sheetId]) {
          const sheetErrors = { ...newErrors[sheetId] };
          delete sheetErrors[functionId];
          newErrors[sheetId] = sheetErrors;
        }
        return newErrors;
      });
    }
  };

  const handleScopeChange = (
    sheetId: string,
    functionId: number,
    newScope: Record<string, number>
  ) => {
    setScopeBySheetAndFunction((prev) => ({
      ...prev,
      [sheetId]: {
        ...(prev[sheetId] || {}),
        [functionId]: newScope,
      },
    }));
  };

  const calculateResult = async (sheetId: string, functionId: number) => {
    const sheet = sheets.find((s) => s.id === sheetId);
    if (!sheet) return;

    const func = sheet.designFunctions.find((f) => f.id === functionId);
    if (!func) return;

    try {
      const variables = func.variables.split(",");
      const scope: Record<string, number> = {};

      for (const variable of variables) {
        const value = variableValues[sheetId]?.[functionId]?.[variable];
        if (value === undefined) {
          setVariableValues((prev) => ({
            ...prev,
            [sheetId]: {
              ...(prev[sheetId] || {}),
              [functionId]: {
                ...(prev[sheetId]?.[functionId] || {}),
                [variable]: 0,
              },
            },
          }));
          scope[variable] = 0;
        } else {
          scope[variable] = value;
        }
      }

      handleScopeChange(sheetId, functionId, scope);

      try {
        const resultData = await evaluateFunction({
          functions: [
            {
              designFunctionId: functionId,
              parameters: scope,
            },
          ],
        }).unwrap();

        const resultValue = resultData.results[0]?.result;

        setResults((prev) => ({
          ...prev,
          [sheetId]: {
            ...(prev[sheetId] || {}),
            [functionId]: resultValue,
          },
        }));

        if (errors[sheetId]?.[functionId]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            if (newErrors[sheetId]) {
              const sheetErrors = { ...newErrors[sheetId] };
              delete sheetErrors[functionId];
              newErrors[sheetId] = sheetErrors;
            }
            return newErrors;
          });
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          [sheetId]: {
            ...(prev[sheetId] || {}),
            [functionId]: `Error: ${
              error instanceof Error ? error.message : "Unknown error occurred"
            }`,
          },
        }));
      }

      if (errors[sheetId]?.[functionId]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          if (newErrors[sheetId]) {
            const sheetErrors = { ...newErrors[sheetId] };
            delete sheetErrors[functionId];
            newErrors[sheetId] = sheetErrors;
          }
          return newErrors;
        });
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [sheetId]: {
          ...(prev[sheetId] || {}),
          [functionId]: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      }));
    }
  };

  const calculateAllResults = () => {
    if (!currentSheet) return;

    currentSheet.designFunctions.forEach((func) => {
      calculateResult(currentSheet.id, func.id);
    });
  };

  const exportToCSV = () => {
    if (!currentSheet) return;

    const sheetId = currentSheet.id;
    const variables = allVariablesBySheet[sheetId] || [];

    let csvContent =
      "Function Name,Expression," + variables.join(",") + ",Result\n";

    currentSheet.designFunctions.forEach((func) => {
      let row = `"${func.name}","${func.expression}",`;

      variables.forEach((variable) => {
        const value = func.variables.includes(variable)
          ? variableValues[sheetId]?.[func.id]?.[variable] ?? ""
          : "";
        row += `${value},`;
      });

      row += `${results[sheetId]?.[func.id] ?? ""}`;

      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${currentSheet.name.replace(/\s+/g, "_")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isVariableUsedInFunction = (
    sheetId: string,
    functionId: number,
    variable: string
  ) => {
    const sheet = sheets.find((s) => s.id === sheetId);
    if (!sheet) return false;

    const func = sheet.designFunctions.find((f) => f.id === functionId);
    if (!func) return false;

    return func.variables
      .split(",")
      .map((v) => v.trim())
      .includes(variable);
  };

  const toggleVariableVisibility = (sheetId: string, variable: string) => {
    setVisibleVariablesBySheet((prev) => {
      const sheetVariables = [...(prev[sheetId] || [])];

      if (sheetVariables.includes(variable)) {
        return {
          ...prev,
          [sheetId]: sheetVariables.filter((v) => v !== variable),
        };
      } else {
        return {
          ...prev,
          [sheetId]: [...sheetVariables, variable],
        };
      }
    });
  };

  const showAllVariables = (sheetId: string) => {
    setVisibleVariablesBySheet((prev) => ({
      ...prev,
      [sheetId]: [...(allVariablesBySheet[sheetId] || [])],
    }));
  };

  const addNewSheet = () => {
    if (!newSheetName.trim()) return;

    const newSheetId = `sheet${Date.now()}`;
    const newSheet: SheetData = {
      id: newSheetId,
      name: newSheetName,
      designTypeId: subTypeWithFunctions.designTypeId,
      designTypeName: subTypeWithFunctions.designTypeName,
      designFunctions: subTypeWithFunctions.designFunctions || [],
    };

    setSheets((prev) => [...prev, newSheet]);
    initializeSheetState(newSheetId);
    setActiveSheet(newSheetId);
    setNewSheetName("");
    setNewSheetDialog(false);
  };

  const deleteSheet = (sheetId: string) => {
    if (sheets.length <= 1) return;

    setSheets((prev) => prev.filter((sheet) => sheet.id !== sheetId));

    if (activeSheet === sheetId) {
      const remainingSheets = sheets.filter((sheet) => sheet.id !== sheetId);
      if (remainingSheets.length > 0) {
        setActiveSheet(remainingSheets[0].id);
      }
    }
  };

  const startEditingSheetName = (sheetId: string, currentName: string) => {
    setEditingSheetId(sheetId);
    setEditingSheetName(currentName);
  };

  const saveEditedSheetName = () => {
    if (!editingSheetId || !editingSheetName.trim()) {
      setEditingSheetId(null);
      return;
    }

    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === editingSheetId
          ? { ...sheet, name: editingSheetName }
          : sheet
      )
    );

    setEditingSheetId(null);
  };

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Calculos Programa De Diseño</h1>
        <div className="flex gap-2">
          <Button primary onClick={() => setNewSheetDialog(true)}>
            <FaPlus className="mr-2" size={12} />
            Nuevo Sub Programa
          </Button>

          <Button onClick={exportToCSV} className="bg-gray-200 text-gray-800">
            <FaDownload className="mr-2" size={12} />
            Exportar Calculos
          </Button>
        </div>
      </div>

      {newSheetDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Crear nuevo sub programa</h2>

            <div className="mb-4">
              <input
                id="sheet-name"
                type="text"
                value={newSheetName}
                onChange={(e) => setNewSheetName(e.target.value)}
                placeholder="Ingrese el nombre de la hoja..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={() => setNewSheetDialog(false)}>
                <FaTimes className="mr-2" size={12} />
                Cancelar
              </Button>
              <Button primary onClick={addNewSheet}>
                <FaPlus className="mr-2" size={12} />
                Crear
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {sheets.map((sheet) => (
            <div key={sheet.id} className="relative">
              <Button
                onClick={() => setActiveSheet(sheet.id)}
                className={`flex items-center px-4 py-2 border-t border-l border-r rounded-t-md relative ${
                  activeSheet === sheet.id
                    ? "bg-white border-gray-300 text-blue-600"
                    : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaFileAlt className="mr-2" size={14} />
                {editingSheetId === sheet.id ? (
                  <div className="flex items-center">
                    <input
                      value={editingSheetName}
                      onChange={(e) => setEditingSheetName(e.target.value)}
                      className="w-32 px-1 py-0 text-sm border border-gray-300 rounded"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          saveEditedSheetName();
                        }
                      }}
                    />
                    <Button
                      className="ml-1 p-1 text-gray-600 hover:text-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        saveEditedSheetName();
                      }}
                    >
                      <FaCheck size={12} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex w-28 justify-between">
                    <span>{sheet.name}</span>
                    <button
                      className="text-sm hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingSheetName(sheet.id, sheet.name);
                      }}
                    >
                      <FaPencilAlt className="ml-6" size={10} />
                    </button>
                    <button
                      className={`text-sm text-red-600 hover:bg-gray-100  ${
                        sheets.length <= 1
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (sheets.length > 1) {
                          deleteSheet(sheet.id);
                        }
                      }}
                      disabled={sheets.length <= 1}
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {sheets.map((sheet) => (
        <div
          key={sheet.id}
          className={`mt-4 ${activeSheet === sheet.id ? "block" : "hidden"}`}
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">
                    {sheet.designTypeName}: {sheet.name}
                  </h2>
                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full border border-gray-200">
                    {sheet.designFunctions.length} funciones
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaSearch className="text-gray-400" size={12} />
                    </div>
                    <input
                      type="search"
                      placeholder="Buscar funciones..."
                      className="w-[200px] pl-8 pr-8 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setSearchTerm("")}
                      >
                        <FaTimes
                          className="text-gray-400 hover:text-gray-600"
                          size={12}
                        />
                      </button>
                    )}
                  </div>

                  <Button
                    onClick={calculateAllResults}
                    success
                    className="flex items-center px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
                  >
                    <FaSync className="mr-2" size={12} />
                    Calcular todo
                  </Button>
                  {/* 
                  <Button
                    primary
                    className="flex items-center px-3 py-1.5 text-sm"
                  >
                    <FaSave className="mr-2" size={12} />
                    Guardar
                  </Button> */}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">Variables:</span>
                  {(allVariablesBySheet[sheet.id] || []).map((variable) => (
                    <button
                      key={variable}
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        (visibleVariablesBySheet[sheet.id] || []).includes(
                          variable
                        )
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                      onClick={() =>
                        toggleVariableVisibility(sheet.id, variable)
                      }
                    >
                      {variable}
                    </button>
                  ))}
                  {(visibleVariablesBySheet[sheet.id] || []).length <
                    (allVariablesBySheet[sheet.id] || []).length && (
                    <button
                      onClick={() => showAllVariables(sheet.id)}
                      className="px-2 py-0.5 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mostrar todo
                    </button>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="overflow-x-auto" style={{ maxHeight: "500px" }}>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="sticky left-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[180px]">
                          Función
                        </th>
                        {(visibleVariablesBySheet[sheet.id] || []).map(
                          (variable) => (
                            <th
                              key={variable}
                              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]"
                            >
                              {variable}
                            </th>
                          )
                        )}
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                          Resultado
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(sheet.id === activeSheet
                        ? filteredFunctions
                        : sheet.designFunctions
                      ).map((func) => (
                        <tr key={func.id} className="hover:bg-gray-50">
                          <td className="sticky left-0 bg-white px-6 py-4 whitespace-nowrap z-10">
                            <div className="flex flex-col">
                              <div
                                className="font-medium text-sm text-gray-900 truncate max-w-[180px]"
                                title={func.name}
                              >
                                {func.name}
                              </div>
                              <div className="mt-1">
                                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full border border-gray-200">
                                  {func.variables.split(",").length} var
                                </span>
                              </div>
                            </div>
                          </td>

                          {(visibleVariablesBySheet[sheet.id] || []).map(
                            (variable) => (
                              <td
                                key={`${func.id}-${variable}`}
                                className="px-6 py-4 whitespace-nowrap"
                              >
                                {isVariableUsedInFunction(
                                  sheet.id,
                                  func.id,
                                  variable
                                ) ? (
                                  <input
                                    type="number"
                                    placeholder="0"
                                    value={
                                      variableValues[sheet.id]?.[func.id]?.[
                                        variable
                                      ] ?? ""
                                    }
                                    onChange={(e) =>
                                      handleInputChange(
                                        sheet.id,
                                        func.id,
                                        variable,
                                        e.target.value
                                      )
                                    }
                                    className="w-full h-8 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                ) : (
                                  <div className="h-8 flex items-center justify-center text-gray-400">
                                    -
                                  </div>
                                )}
                              </td>
                            )
                          )}

                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {errors[sheet.id]?.[func.id] ? (
                              <span className="text-red-500 text-sm">
                                {errors[sheet.id][func.id]}
                              </span>
                            ) : (
                              <span className="font-bold">
                                {results[sheet.id]?.[func.id] !== undefined
                                  ? results[sheet.id][func.id]
                                  : "-"}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Button
                              onClick={() => calculateResult(sheet.id, func.id)}
                              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded border-x-0 border-y-0"
                            >
                              <FaCalculator size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {sheet.id === activeSheet &&
                        filteredFunctions.length === 0 && (
                          <tr>
                            <td
                              colSpan={
                                4 +
                                (visibleVariablesBySheet[sheet.id] || []).length
                              }
                              className="px-6 py-12 text-center text-gray-500"
                            >
                              No hay funciones disponibles para mostrar.
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            {subTypeWithFunctions.designFunctions &&
              subTypeWithFunctions.designFunctions.length > 0 && (
                <FunctionsGraph
                  functions={subTypeWithFunctions.designFunctions}
                  scopeByFunction={scopeBySheetAndFunction[sheet.id] || {}}
                />
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgramCalculations;
