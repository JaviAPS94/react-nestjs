import { useState } from "react";
import { ElementResponse } from "../../commons/types";
import ValuesList from "./ValuesList";
import ValueModal from "./ValueModal";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Tooltip from "../core/Tooltip";
import { useNorm } from "../../hooks/useNorm";

interface DataTableProps {
  data: ElementResponse[];
  setBaseFields: React.Dispatch<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.SetStateAction<Record<string, Record<string, any>> | undefined>
  >;
  setSelectedSubType: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const DataTable = ({
  data,
  setBaseFields,
  setSelectedSubType,
}: DataTableProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { [key: string]: any } | Record<string, any>[]
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const itemsPerPage = 5;
  const { toogleShowAddElement, toogleShowAddElementButton } = useNorm();

  const openModal = (
    e: React.MouseEvent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: { [key: string]: any } | Record<string, any>[]
  ) => {
    e.stopPropagation();
    setSelectedValues(values);
    setModalOpen(true);
  };

  const handleMouseEnter = (e: React.MouseEvent, id: number) => {
    setHoveredRow(id);
    setIsTooltipVisible(true);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTooltipVisible) {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
    setIsTooltipVisible(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const deleteKey = (
    obj: Record<string, unknown>,
    keyToDelete: string
  ): Record<string, unknown> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [keyToDelete]: _, ...rest } = obj; // Destructure to remove the key
    return rest; // Return the updated object
  };

  const handleRowClick = (id: number) => {
    setBaseFields({});
    const currentElement = data.find((element) => element.id === id);
    const transformedObject = currentElement?.values.reduce(
      (acc, { key, name, value, type }) => {
        acc[key] = { label: name, type };
        if (value) acc[key].value = value;
        return acc;
      },
      {} as Record<string, { label: string; type: string; value?: string }>
    );
    setSelectedSubType(currentElement?.subType.id || 0);
    setBaseFields(deleteKey(transformedObject!, "accesories"));
    toogleShowAddElement();
    toogleShowAddElementButton();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valores
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sub Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Norma
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                País
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item) => (
              <tr
                key={item.id}
                onClick={() => handleRowClick(item.id)}
                onMouseEnter={(e) => handleMouseEnter(e, item.id)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`cursor-pointer transition-colors duration-200 ${
                  hoveredRow === item.id ? "bg-blue-100" : "hover:bg-blue-50"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                <td className="px-6 py-4">
                  <ValuesList
                    values={item.values}
                    setIsTooltipVisible={setIsTooltipVisible}
                  />
                  <button
                    onClick={(e) => openModal(e, item.values)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    onMouseEnter={() => {
                      setIsTooltipVisible(false);
                    }}
                    onMouseLeave={() => {
                      setIsTooltipVisible(true);
                    }}
                  >
                    Ver todos
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.subType.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.norm.name} (v{item.norm.version})
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.norm.country.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando{" "}
            <span className="font-medium">{indexOfFirstItem + 1}</span> a{" "}
            <span className="font-medium">
              {Math.min(indexOfLastItem, data.length)}
            </span>{" "}
            de <span className="font-medium">{data.length}</span> resultados
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Anterior</span>
              <BiChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === i + 1
                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Siguiente</span>
              <BiChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
      <ValueModal
        values={selectedValues}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <Tooltip
        text="Presiona aquí para cargar este elemento"
        visible={isTooltipVisible}
        position={tooltipPosition}
      />
    </div>
  );
};

export default DataTable;
