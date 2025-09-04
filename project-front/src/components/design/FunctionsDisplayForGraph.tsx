import type React from "react";

import { useState, useEffect, useMemo } from "react";
import {
  BiSolidHide,
  BiSolidShow,
  BiChevronLeft,
  BiChevronRight,
  BiSearch,
  BiX,
} from "react-icons/bi";
import { FunctionWithAdditionalData } from "./FunctionsGraph";

interface FunctionsDisplayForGraphProps {
  functionsWithAdditionalData: FunctionWithAdditionalData[];
  setFunctionsWithAdditionalData: React.Dispatch<
    React.SetStateAction<FunctionWithAdditionalData[]>
  >;
  scopeByFunction: Record<number, Record<string, number>>;
  generateFunctionChartData: () => void;
}

const FunctionsDisplayForGraph = ({
  functionsWithAdditionalData,
  setFunctionsWithAdditionalData,
  scopeByFunction,
  generateFunctionChartData,
}: FunctionsDisplayForGraphProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter functions based on search query
  const filteredFunctions = useMemo(() => {
    if (!searchQuery.trim()) return functionsWithAdditionalData;

    return functionsWithAdditionalData.filter((func) =>
      func.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [functionsWithAdditionalData, searchQuery]);

  // Get visible functions
  const visibleFunctions = useMemo(() => {
    return functionsWithAdditionalData.filter((func) => func.visible);
  }, [functionsWithAdditionalData]);

  // Calculate total pages
  const totalPages = Math.max(
    1,
    Math.ceil(filteredFunctions.length / itemsPerPage)
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  // Update items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 768) {
        setItemsPerPage(3);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(6);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get current page items
  const currentItems = filteredFunctions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const toggleFunction = (index: number) => {
    const globalIndex = filteredFunctions.indexOf(currentItems[index]);
    const originalIndex = functionsWithAdditionalData.findIndex(
      (f) => f.id === filteredFunctions[globalIndex].id
    );

    const updatedFunctions = [...functionsWithAdditionalData];
    updatedFunctions[originalIndex].visible =
      !updatedFunctions[originalIndex].visible;
    setFunctionsWithAdditionalData(updatedFunctions);
    generateFunctionChartData();
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNextPage();
    }
    if (isRightSwipe) {
      goToPrevPage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Search input */}
      <div className="relative">
        <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar funciones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            <BiX />
          </button>
        )}
      </div>

      {/* Header with pagination controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Funciones Disponibles</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {filteredFunctions.length === 0
              ? "No hay funciones disponibles"
              : `Página ${currentPage + 1} de ${totalPages}`}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={goToPrevPage}
              disabled={filteredFunctions.length === 0}
              aria-label="Previous page"
              className={`p-1 rounded-md border ${
                filteredFunctions.length === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <BiChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNextPage}
              disabled={filteredFunctions.length === 0}
              aria-label="Next page"
              className={`p-1 rounded-md border ${
                filteredFunctions.length === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <BiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Function cards */}
      <div
        className="w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {filteredFunctions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              No hay funciones que coincidan con tu búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 transition-all duration-300">
            {currentItems.map((func, index) => (
              <div
                key={func.id}
                className={`p-4 flex flex-col items-center justify-between h-40 rounded-lg shadow-sm border transition-all duration-200 ${
                  func.visible
                    ? "border-gray-300"
                    : "border-gray-200 bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: func.color }}
                  />
                </div>
                <div className="text-center">
                  <div
                    className={`font-medium ${
                      func.visible ? "" : "text-gray-500"
                    }`}
                  >
                    {func.name}
                  </div>
                </div>
                <button
                  onClick={() => toggleFunction(index)}
                  className="mt-2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  aria-label={func.visible ? "Hide function" : "Show function"}
                >
                  {func.visible ? <BiSolidHide /> : <BiSolidShow />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile pagination dots */}
      {filteredFunctions.length > 0 && (
        <div className="flex justify-center space-x-1 mt-4 sm:hidden">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentPage === index ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setCurrentPage(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Active functions section */}
      <div className="mt-8 border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-medium">
            Funciones seleccionadas para gráfica
          </h3>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
            {visibleFunctions.length} activas
          </span>
        </div>

        {visibleFunctions.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No hay funciones activas</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {visibleFunctions.map((func) => (
              <div
                key={func.id}
                className="flex items-center space-x-2 p-2 border rounded-md bg-white shadow-sm"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: func.color }}
                />
                <span className="text-sm font-medium">{func.name}</span>
                {!scopeByFunction[func.id] && (
                  <span className="text-xs text-amber-600">
                    (sin parámetros)
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionsDisplayForGraph;
