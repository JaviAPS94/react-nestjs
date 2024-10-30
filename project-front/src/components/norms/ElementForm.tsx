import { useEffect, useState } from "react";
import Modal from "react-modal";
import { toCamelCase } from "../../commons/functions";
import { ElementValue, NormElement } from "../../pages/NewNormPage";

interface FormData {
  customFields: ElementValue[];
}

interface ElementFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseFieldsValue: Record<string, Record<string, any>>;
  handleAddElementToNorm: (element: NormElement) => void;
}

const ElementForm = ({
  baseFieldsValue,
  handleAddElementToNorm,
}: ElementFormProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newField, setNewField] = useState<Omit<ElementValue, "value">>({
    name: "",
    type: "text",
    key: "",
  });
  const [formData, setFormData] = useState<FormData>({
    customFields: [],
  });

  useEffect(() => {
    const initializeCustomFields = () => {
      const base = baseFieldsValue;
      const customFields = base
        ? Object.entries(base).map(([key, value]) => ({
            key,
            name: value.label,
            value: value.value,
            type: value.type,
          }))
        : [];

      setFormData((prevData) => ({
        ...prevData,
        customFields,
      }));
    };

    initializeCustomFields();
  }, [baseFieldsValue]); // Empty dependency array ensures this runs once on mount

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleAddField = () => {
    if (newField.name && newField.type) {
      setFormData((prevData) => ({
        ...prevData,
        customFields: [
          ...prevData.customFields,
          { ...newField, value: "", key: toCamelCase(newField.name) },
        ],
      }));
      setNewField({ name: "", type: "text", key: "" });
      closeModal();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value, type, files } = e.target;
    if (index !== undefined) {
      setFormData((prevData) => {
        const updatedFields = [...prevData.customFields];
        updatedFields[index] = {
          ...updatedFields[index],
          [name]: type === "file" ? files?.[0] : value,
        };
        return { ...prevData, customFields: updatedFields };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleInsertElement = () => {
    const element: NormElement = {
      values: formData.customFields,
    };
    handleAddElementToNorm(element);
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Información del elemento</h2>
        <button
          type="button"
          onClick={openModal}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Agregar campo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formData.customFields.map((field, index) => (
          <div key={index} className="col-span-1">
            <label className="block font-medium">{field.name}</label>
            {field.type === "file" ? (
              <input
                type="file"
                name="value"
                onChange={(e) => handleChange(e, index)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 my-5"
              />
            ) : field.type === "date" ? (
              <input
                type="date"
                name="value"
                value={typeof field.value === "string" ? field.value : ""}
                onChange={(e) => handleChange(e, index)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 my-5"
              />
            ) : (
              <input
                type={field.type}
                name="value"
                placeholder="Ingrese un valor"
                value={typeof field.value === "string" ? field.value : ""}
                onChange={(e) => handleChange(e, index)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 my-5"
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleInsertElement}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Insertar elemento a la norma
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Select Field Type and Name"
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-25"
      >
        <div className="bg-white p-6 rounded-md shadow-lg">
          <h2 className="text-lg font-medium">Agregar un nuevo campo</h2>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Nombre del campo
            </label>
            <input
              type="text"
              name="name"
              value={newField.name}
              onChange={(e) =>
                setNewField({ ...newField, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Tipo del campo
            </label>
            <select
              name="type"
              value={newField.type}
              onChange={(e) =>
                setNewField({ ...newField, type: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option value="text">Texto</option>
              <option value="number">Numérico</option>
              <option value="date">Fecha</option>
              <option value="file">Archivo</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAddField}
              className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Agregar campo
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ElementForm;
