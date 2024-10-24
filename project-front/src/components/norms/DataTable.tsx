import { useState } from "react";
import { ElementResponse } from "../../commons/types";
import ValuesList from "./ValuesList";
import ValueModal from "./ValueModal";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Tooltip from "../core/Tooltip";

const DataTable: React.FC<{ data: ElementResponse[] }> = ({ data }) => {
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
  const tooltipDelay = 500;
  let tooltipTimer: number | null = null;

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
    tooltipTimer = setTimeout(() => {
      setIsTooltipVisible(true);
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }, tooltipDelay);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTooltipVisible) {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
    setIsTooltipVisible(false);
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleRowClick = (id: number) => {
    alert(`You clicked on row with ID: ${id}`);
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
                Tipo
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
                  <ValuesList values={item.values} />
                  <button
                    onClick={(e) => openModal(e, item.values)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    onMouseEnter={() => {
                      if (tooltipTimer) {
                        clearTimeout(tooltipTimer);
                      }
                      setIsTooltipVisible(false);
                    }}
                  >
                    Ver todos
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.type.name}
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
        text="Click for more information"
        visible={isTooltipVisible}
        position={tooltipPosition}
      />
    </div>
  );
};

export default DataTable;
