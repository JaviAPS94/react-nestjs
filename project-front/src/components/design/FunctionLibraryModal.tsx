import React from "react";
import { Modal } from "../core/Modal";
import Pagination from "../core/Pagination";
import { CustomFunction } from "./spreadsheet-types";

interface FunctionLibraryModalProps {
  isOpen: boolean;
  customFunctions: CustomFunction[];
  searchTerm: string;
  currentPage: number;
  functionsPerPage: number;
  onClose: () => void;
  onSearchChange: (term: string) => void;
  onPageChange: (page: number) => void;
  onInsertFunction: (func: CustomFunction) => void;
}

const FunctionLibraryModal: React.FC<FunctionLibraryModalProps> = ({
  isOpen,
  customFunctions,
  searchTerm,
  currentPage,
  functionsPerPage,
  onClose,
  onSearchChange,
  onPageChange,
  onInsertFunction,
}) => {
  if (!isOpen) return null;

  // Filter functions based on search term
  const filteredFunctions = customFunctions.filter((func) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      func.name.toLowerCase().includes(searchLower) ||
      func.description.toLowerCase().includes(searchLower) ||
      func.variables.some((v) => v.toLowerCase().includes(searchLower)) ||
      func.formula.toLowerCase().includes(searchLower)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredFunctions.length / functionsPerPage);
  const startIndex = (currentPage - 1) * functionsPerPage;
  const endIndex = startIndex + functionsPerPage;
  const currentFunctions = filteredFunctions.slice(startIndex, endIndex);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        onSearchChange("");
        onPageChange(1);
      }}
      title="Biblioteca de funciones"
      size="full"
    >
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar funciones por nombre, descripción o variables..."
              value={searchTerm}
              onChange={(e) => {
                onSearchChange(e.target.value);
                onPageChange(1); // Reset to first page when searching
              }}
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
            {searchTerm && (
              <button
                onClick={() => {
                  onSearchChange("");
                  onPageChange(1);
                }}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Results info */}
        <div className="mb-4 text-sm text-gray-600">
          {searchTerm ? (
            <span>
              {filteredFunctions.length} función encontrada
              {filteredFunctions.length !== 1 ? "s" : ""}
              {searchTerm && ` coincidiendo con "${searchTerm}"`}
            </span>
          ) : (
            <span>Mostrando {customFunctions.length} funciones totales</span>
          )}
          {totalPages > 1 && (
            <span className="ml-2">
              (Página {currentPage} de {totalPages})
            </span>
          )}
        </div>

        {/* Functions Grid */}
        <div className="flex-1 overflow-y-auto mb-4">
          {currentFunctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentFunctions.map((func) => (
                <div
                  key={func.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-blue-600">
                      {func.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 flex-1">
                    {func.description}
                  </p>
                  <div className="text-sm mb-3">
                    <strong>Variables:</strong>
                    <span className="text-blue-600 font-mono">
                      {` ${func.variables.join(", ")}`}
                    </span>
                  </div>
                  <div className="text-sm mb-3">
                    <strong>Uso:</strong>{" "}
                    <code className="bg-gray-100 px-1 rounded text-xs break-all">
                      ={func.code}({func.variables.join(", ")})
                    </code>
                  </div>
                  <button
                    onClick={() => onInsertFunction(func)}
                    className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-auto"
                  >
                    Insertar función
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? (
                <div>
                  <div className="text-4xl mb-2">🔍</div>
                  <p>No hay funciones con tu búsqueda "{searchTerm}"</p>
                  <p className="text-sm mt-1">
                    Intenta con otro término de búsqueda o agrega una nueva
                    función.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2">📚</div>
                  <p>No hay funciones disponibles</p>
                  <p className="text-sm mt-1">
                    Agrega tu primera función personalizada!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex align-middle mx-auto mt-4 text-2xl space-x-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FunctionLibraryModal;
