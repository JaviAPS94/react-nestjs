import React, { useState } from "react";
import ElementForm from "./ElementForm";

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

const NormForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    customFields: [],
  });

  const [country, setCountry] = useState<string>("");
  const [showAddElement, setShowAddElement] = useState<boolean>(false);

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

  const handleAddElementClick = () => {
    console.log("add element");
  };

  return (
    <div className="flex items-center justify-center max-w-full">
      <form className="space-y-4 p-4 bg-white rounded-md shadow-lg w-full max-w-[50rem] min-h-[30rem]">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Norma
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Versión
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            País
          </label>
          <select
            name="type"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          >
            <option value="text">Colombia</option>
            <option value="number">Argentina</option>
            <option value="date">Ecuador</option>
            <option value="file">Chile</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setShowAddElement(!showAddElement)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Agregar elemento
        </button>

        {showAddElement && <ElementForm />}

        {formData.customFields.length > 0 && (
          <table className="min-w-full mt-4 bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Field Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Field Type
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Field Value
                </th>
              </tr>
            </thead>
            <tbody>
              {formData.customFields.map((field, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {field.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {field.type}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {field.type === "file"
                      ? field.value instanceof File
                        ? field.value.name
                        : "No file selected"
                      : typeof field.value === "string"
                      ? field.value
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </form>
    </div>
  );
};

export default NormForm;
