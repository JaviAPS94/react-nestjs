import React, { useState } from "react";
import Modal from "react-modal";
import ElementForm from "./ElementForm";
import { Country, ElementResponse, Type } from "../../commons/types";
import { NormData, NormElement } from "../../pages/NewNormPage";
import DataTable from "./DataTable";

interface NormFormProps {
  countries: Country[] | undefined;
  types: Type[] | undefined;
  formData: NormData;
  setFormData: React.Dispatch<React.SetStateAction<NormData>>;
  elementsByFilters: ElementResponse[] | undefined;
}

const NormForm = ({
  countries,
  types,
  formData,
  setFormData,
  elementsByFilters,
}: NormFormProps) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [showAddElement, setShowAddElement] = useState<boolean>(false);
  const [baseFields, setBaseFields] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<Record<string, Record<string, any>>>();
  const [showAddElementButton, setShowAddElementButton] = useState(true);
  const [typeModalIsOpen, setTypeModalIsOpen] = useState(false);

  const openTypeModal = () => setTypeModalIsOpen(true);
  const closeTypeModal = () => setTypeModalIsOpen(false);

  const handleShowAddElement = () => {
    setBaseFields(
      types?.find((type) => type.id === Number(selectedType))?.field.base
    );
    setShowAddElement(true);
    setShowAddElementButton(false);
    closeTypeModal();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleAddElementToNorm = (element: NormElement) => {
    const elementWithType = {
      ...element,
      type: Number(selectedType),
    };
    setFormData((prevData) => ({
      ...prevData,
      elements: [...prevData.elements, elementWithType],
    }));
    setShowAddElementButton(true);
    setShowAddElement(false);
    setSelectedType("");
  };

  const handleSelectedType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Formulario de ingreso de datos
        </h2>
        <label className="block text-sm font-medium text-gray-700">Norma</label>
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
          name="version"
          value={formData.version}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">País</label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        >
          <option value="" disabled>
            Selecciona un país
          </option>
          {countries?.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {showAddElementButton && (
        <button
          type="button"
          onClick={openTypeModal}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Agregar elemento
        </button>
      )}

      <Modal
        isOpen={typeModalIsOpen}
        onRequestClose={closeTypeModal}
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-25"
      >
        <div className="bg-white p-6 rounded-md shadow-lg">
          <h2 className="text-lg font-medium">
            Selecciona el tipo de elemento que quieres agregar
          </h2>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              name="type"
              value={selectedType}
              onChange={handleSelectedType}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option value="" disabled>
                Selecciona un tipo
              </option>
              {types?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleShowAddElement}
              className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Continuar
            </button>
          </div>
        </div>
      </Modal>

      {showAddElement && baseFields && (
        <ElementForm
          baseFieldsValue={baseFields}
          handleAddElementToNorm={handleAddElementToNorm}
        />
      )}
      <h2 className="mt-5 font-bold text-xl">Elementos que podrías cargar</h2>
      <DataTable
        data={elementsByFilters ?? []}
        setBaseFields={setBaseFields}
        setShowAddElement={setShowAddElement}
        setShowAddElementButton={setShowAddElementButton}
        setSelectedType={setSelectedType}
      />
    </>
  );
};

export default NormForm;
