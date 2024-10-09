import React, { useState } from "react";
import { NormData } from "../../pages/NewNormPage";

interface NormInformationProps {
  formData: NormData;
  setFormData: React.Dispatch<React.SetStateAction<NormData>>;
}

const NormInformation = ({ formData, setFormData }: NormInformationProps) => {
  const [expandedElements, setExpandedElements] = useState<number[]>([]);

  const toggleElement = (index: number) => {
    setExpandedElements((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleRemoveElement = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      elements: prevData.elements.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <div className="px-6">
        <h2 className="text-2xl font-bold mb-4">
          Información ingresada de la norma
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Datos Principales</h3>
            <p>
              <span className="font-medium">Norma:</span> {formData.name}
            </p>
            <p>
              <span className="font-medium">Versión:</span> {formData.version}
            </p>
            <p>
              <span className="font-medium">País:</span> {formData.country}
            </p>
          </div>
          {formData.elements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Elementos</h3>
              {formData.elements.map((element, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="flex justify-between items-start">
                    <button
                      onClick={() => toggleElement(index)}
                      className="font-medium text-left flex items-center"
                    >
                      <span
                        className={`transform transition-transform ${
                          expandedElements.includes(index) ? "rotate-90" : ""
                        }`}
                      >
                        ▶
                      </span>
                      <span className="ml-2">Elemento: {index + 1}</span>
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                      onClick={() => handleRemoveElement(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                  {expandedElements.includes(index) && (
                    <div className="mt-2">
                      <h4 className="font-medium mt-2">Tipo: {element.type}</h4>
                      <h4 className="font-medium mt-2">Valores:</h4>
                      <ul className="list-disc pl-5">
                        {element.values.map((value, vIndex) => (
                          <li key={vIndex}>
                            <span className="font-medium">{value.name}:</span>{" "}
                            {value.value instanceof File
                              ? value.value.name
                              : value.value}
                            <span className="ml-2 text-sm text-gray-500">
                              ({value.type})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NormInformation;
