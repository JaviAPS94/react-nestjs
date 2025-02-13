import React, { useEffect, useState } from "react";
import { NormData } from "../../pages/NewNormPage";
import Button from "../core/Button";
import { useSaveNormMutation } from "../../store";
import Alert from "../core/Alert";
import AccesoriesTable from "./AccesoriesTable";
import { Accessory } from "../../commons/types";
import { FaSave } from "react-icons/fa";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useNorm } from "../../hooks/useNorm";

interface NormInformationProps {
  formData: NormData;
  setFormData: React.Dispatch<React.SetStateAction<NormData>>;
}

const NormInformation = ({ formData, setFormData }: NormInformationProps) => {
  const [expandedElements, setExpandedElements] = useState<number[]>([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const {
    disableEdit,
    handleEditingElement,
    handleShowAddElement,
    handleShowAddElementButton,
    handleDisableEdit,
  } = useNorm();

  const [saveNorm, saveNormResult] = useSaveNormMutation();

  useEffect(() => {
    if (saveNormResult.isSuccess) {
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      setFormData({
        name: "",
        version: "",
        country: 0,
        elements: [],
      });
    }

    if (saveNormResult.isError) {
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
    }
  }, [saveNormResult]);

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

  const handleEditItem = (index: number) => {
    handleDisableEdit(true);
    handleShowAddElement(true);
    handleShowAddElementButton(false);
    handleEditingElement(index);
  };

  const objectToFormData = (data: NormData): FormData => {
    const formData = new FormData();

    // Append top-level fields
    formData.append("name", data.name!);
    formData.append("version", data.version);
    formData.append("country", data.country!.toString());

    // Append elements
    data.elements.forEach((element, elementIndex) => {
      formData.append(
        `elements[${elementIndex}].subType`,
        element.subType?.toString() || ""
      );
      formData.append(
        `elements[${elementIndex}].sapReference`,
        element.sapReference
      );
      formData.append(
        `elements[${elementIndex}].specialItem`,
        element.specialItem?.toString() || ""
      );

      element.values.forEach((value, valueIndex) => {
        // Use the nested structure as specified
        const formattedKey = `elements[${elementIndex}].values[${valueIndex}]`;

        // Append the properties of the value
        formData.append(`${formattedKey}.key`, value.key);
        formData.append(`${formattedKey}.name`, value.name);
        formData.append(`${formattedKey}.type`, value.type);

        // Append the value based on its type
        if (value.type === "file" && value.value instanceof File) {
          formData.append(`${formattedKey}.value`, value.value); // Append the File
        } else if (value.type === "object") {
          formData.append(`${formattedKey}.value`, JSON.stringify(value.value)); // Append string value
        } else {
          formData.append(`${formattedKey}.value`, value.value!.toString());
        }
      });
    });

    return formData;
  };

  const handleSaveNorm = () => {
    const formaDataTransformed = objectToFormData(formData);
    saveNorm(formaDataTransformed);
  };

  const renderValue = (value: unknown): string | JSX.Element => {
    if (value instanceof File) {
      return value.name;
    } else if (typeof value === "string" || value instanceof String) {
      return value as string;
    } else {
      if (value !== undefined) {
        try {
          return <AccesoriesTable accessories={value as Accessory[]} />;
        } catch {
          return "Invalid Value";
        }
      }
    }
    return "Unknown Value";
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
                    <div className="flex">
                      <Button
                        primary
                        className="py-1 px-3 rounded text-sm"
                        onClick={() => handleEditItem(index)}
                        disabled={disableEdit}
                      >
                        <BiEdit />
                      </Button>
                      <Button
                        danger
                        className="py-1 px-3 rounded text-sm"
                        onClick={() => handleRemoveElement(index)}
                        disabled={disableEdit}
                      >
                        <BiTrash />
                      </Button>
                    </div>
                  </div>
                  {expandedElements.includes(index) && (
                    <div className="mt-2">
                      <h4 className="font-medium mt-2">
                        Sub Tipo: {element.subType}
                      </h4>
                      <h4 className="font-medium mt-2">Valores:</h4>
                      <ul className="list-disc pl-5">
                        {element.values.map((value, vIndex) => (
                          <li key={vIndex}>
                            <span className="font-medium">{value.name}:</span>{" "}
                            {renderValue(value.value)}
                            <span className="ml-2 text-sm text-gray-500">
                              ({value.type})
                            </span>
                          </li>
                        ))}
                        <li>
                          <span className="font-medium">Referencia SAP:</span>{" "}
                          {element.sapReference}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              <Button
                success
                loading={saveNormResult.isLoading}
                onClick={handleSaveNorm}
                icon={<FaSave />}
                disabled={disableEdit}
              >
                Guardar Norma
              </Button>
            </div>
          )}
        </div>
      </div>
      {showErrorAlert && <Alert error message="Error guardando la norma!" />}
      {showSuccessAlert && (
        <Alert success message="Norma guardada exitosamente!" />
      )}
    </div>
  );
};

export default NormInformation;
