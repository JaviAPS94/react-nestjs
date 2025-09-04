import React, { useState } from "react";
import { Template } from "../../commons/types";
import { Modal } from "../core/Modal";
import Pagination from "../core/Pagination";

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onLoadTemplate: (template: Template) => void;
  onSearchChange: (term: string) => void;
  onPageChange: (page: number) => void;
  searchTerm: string;
  currentPage: number;
}

const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  templates,
  onLoadTemplate,
  onSearchChange,
  onPageChange,
  searchTerm,
  currentPage,
}) => {
  const [templatesPerPage] = useState<number>(10);

  if (!isOpen) return null;

  const handleLoadTemplate = (template: Template) => {
    onLoadTemplate(template);
    onClose();
  };

  // Filter templates based on search term
  const filteredTemplates = templates.filter((template) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      template.name.toLowerCase().includes(searchLower) ||
      template.code.toLowerCase().includes(searchLower)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
  const startIndex = (currentPage - 1) * templatesPerPage;
  const endIndex = startIndex + templatesPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, endIndex);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        onSearchChange("");
        onPageChange(1);
      }}
      title="Biblioteca de plantillas"
      size="full"
    >
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar plantillas por nombre, descripción o categoría..."
              value={searchTerm}
              onChange={(e) => {
                onSearchChange(e.target.value);
                onPageChange(1);
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
              Encontrados {filteredTemplates.length} plantilla
              {filteredTemplates.length !== 1 ? "s" : ""}
              {searchTerm && ` coincidiendo con "${searchTerm}"`}
            </span>
          ) : (
            <span>Mostrando {templates.length} plantillas en total</span>
          )}
          {totalPages > 1 && (
            <span className="ml-2">
              (Página {currentPage} de {totalPages})
            </span>
          )}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto mb-4">
          {currentTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-indigo-600">
                        {template.name}
                      </h3>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {template.code}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 flex-1">
                    {template.description}
                  </p>
                  <button
                    onClick={() => handleLoadTemplate(template)}
                    className="w-full px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 mt-auto"
                  >
                    Cargar Plantilla
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? (
                <div>
                  <div className="text-4xl mb-2">🔍</div>
                  <p>
                    No se encontraron plantillas que coincidan con "{searchTerm}
                    "
                  </p>
                  <p className="text-sm mt-1">
                    Intenta con un término de búsqueda diferente
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2">📋</div>
                  <p>No hay plantillas disponibles</p>
                  <p className="text-sm mt-1">¡Crea tu primera plantilla!</p>
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

export default TemplateLibraryModal;
