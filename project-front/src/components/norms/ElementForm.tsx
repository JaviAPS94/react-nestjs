import { useState } from "react";
import Modal from "react-modal";

interface Field {
  name: string;
  value: string | File;
  type: string;
}

interface FormData {
  name: string;
  description: string;
  price: number;
  customFields: Field[];
}

const ElementForm = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newField, setNewField] = useState<Omit<Field, "value">>({
    name: "",
    type: "text",
  });
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    customFields: [],
  });

  const handleAddField = () => {
    if (newField.name && newField.type) {
      setFormData((prevData) => ({
        ...prevData,
        customFields: [...prevData.customFields, { ...newField, value: "" }],
      }));
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

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3>Datos del elemento</h3>
        <button
          type="button"
          onClick={openModal}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Agregar campo
        </button>
      </div>

      {formData.customFields.map((field, index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-gray-700">
            {field.name}
          </label>
          {field.type === "file" ? (
            <input
              type="file"
              name="value"
              onChange={(e) => handleChange(e, index)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          ) : field.type === "date" ? (
            <input
              type="date"
              name="value"
              value={typeof field.value === "string" ? field.value : ""}
              onChange={(e) => handleChange(e, index)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          ) : (
            <input
              type={field.type}
              name="value"
              placeholder="Field Value"
              value={typeof field.value === "string" ? field.value : ""}
              onChange={(e) => handleChange(e, index)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          )}
        </div>
      ))}
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
