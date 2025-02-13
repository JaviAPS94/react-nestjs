import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import ElementForm from "./ElementForm";
import {
  Country,
  ElementResponse,
  Specification,
  Type,
} from "../../commons/types";
import { NormData, NormElement } from "../../pages/NewNormPage";
import DataTable from "./DataTable";
import { useGetSubTypesWithFieldsByTypeQuery } from "../../store";
import Alert from "../core/Alert";
import Button from "../core/Button";
import { FaPlus, FaTimes } from "react-icons/fa";
import Select, { Option } from "../core/Select";
import { useNorm } from "../../hooks/useNorm";

interface NormFormProps {
  countries: Country[] | undefined;
  types: Type[] | undefined;
  formData: NormData;
  setFormData: React.Dispatch<React.SetStateAction<NormData>>;
  elementsByFilters: ElementResponse[] | undefined;
  specifications: Specification[] | undefined;
}

const NormForm = ({
  countries,
  types,
  formData,
  setFormData,
  elementsByFilters,
  specifications,
}: NormFormProps) => {
  const [selectedType, setSelectedType] = useState<number>();
  const [selectedSubType, setSelectedSubType] = useState<number>();
  const [baseFields, setBaseFields] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<Record<string, Record<string, any>>>();
  const [typeModalIsOpen, setTypeModalIsOpen] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [elementTypeErrors, setElementTypeErrors] = useState<
    Record<string, string>
  >({});
  const [countryCode, setCountryCode] = useState<string | undefined>();
  const [subTypeCode, setSubtypeCode] = useState<string | undefined>();
  const {
    showAddElement,
    toogleShowAddElement,
    showAddElementButton,
    toogleShowAddElementButton,
    editingElement,
    handleDisableEdit,
    handleEditingElement,
  } = useNorm();

  const {
    data: subTypes,
    error: errorSubTypes,
    isLoading: isLoadingSubTypes,
  } = useGetSubTypesWithFieldsByTypeQuery(selectedType || 0);

  useEffect(() => {
    if (errorSubTypes) {
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
    }
  }, [errorSubTypes]);

  const handleOpenTypeModal = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name == "") {
      newErrors.name = "Debes seleccionar el nombre de la norma";
    }

    if (!formData.version || formData.version == "") {
      newErrors.version = "La norma debe tener una versión";
    }

    if (!formData.country) {
      newErrors.country = "Debes seleccionar un país";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setTypeModalIsOpen(true);
    }
  };

  const closeTypeModal = () => setTypeModalIsOpen(false);

  const handleCancelAddElement = () => {
    toogleShowAddElementButton();
    toogleShowAddElement();
    setSelectedType(undefined);
    setSelectedSubType(undefined);
    setElementTypeErrors({});
    closeTypeModal();
  };

  const handleShowAddElement = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedType) {
      newErrors.type = "Debes seleccionar un tipo";
    }

    if (!selectedSubType) {
      newErrors.subType = "Debes seleccionar un sub tipo";
    }

    setElementTypeErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setBaseFields(
        subTypes?.find((subType) => subType.id === Number(selectedSubType))
          ?.field.base
      );
      toogleShowAddElement();
      toogleShowAddElementButton();
      closeTypeModal();
      handleDisableEdit(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleCountryChange = (countryId: number | undefined) => {
    setFormData({ ...formData, country: countryId });
    setCountryCode(
      countries?.find((country) => country.id === countryId)?.isoCode
    );
  };

  const handleNormChange = (normCode: string | undefined) => {
    setFormData({ ...formData, name: normCode });
  };

  const handleAddElementToNorm = (element: NormElement) => {
    const elementWithType = {
      ...element,
      subType: Number(selectedSubType),
    };
    setFormData((prevData) => ({
      ...prevData,
      elements: [...prevData.elements, elementWithType],
    }));
    toogleShowAddElementButton();
    toogleShowAddElement();
    setSelectedType(undefined);
    setSelectedSubType(undefined);
  };

  const handleUpdateElementNorm = (element: NormElement) => {
    setFormData((prevData) => {
      const elements = [...prevData.elements];
      elements[editingElement!] = element;
      return {
        ...prevData,
        elements,
      };
    });
    toogleShowAddElementButton();
    toogleShowAddElement();
    setSelectedType(undefined);
    setSelectedSubType(undefined);
    handleDisableEdit(false);
    handleEditingElement(null);
  };

  const handleSelectedType = (typeId: number | undefined) => {
    setSelectedType(typeId);
  };

  const handleSubTypeChange = (subTypeId: number | undefined) => {
    setSelectedSubType(subTypeId);
    setSubtypeCode(subTypes?.find((subType) => subType.id === subTypeId)?.code);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Formulario de ingreso de datos
        </h2>
        <label className="block text-sm font-medium text-gray-700">Norma</label>
        <Select
          options={specifications?.map(
            (specification) =>
              ({
                label: specification.name,
                value: specification.code,
              } as Option<string>)
          )}
          selectedValue={formData.name}
          onChange={handleNormChange}
          isLoading={false}
          placeholder="Selecciona una norma"
          error={errors}
          errorKey="name"
          disabled={formData.elements.length > 0}
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Versión
        </label>
        <input
          type="text"
          name="version"
          value={formData.version}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:outline-none focus:ring-2 ${
            errors.version
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-blue-500"
          }`}
          disabled={formData.elements.length > 0}
        />
        {errors.version && (
          <span className="text-red-500 text-sm">{errors.version}</span>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">País</label>
        <Select
          options={countries?.map(
            (country) =>
              ({
                label: country.name,
                value: country.id,
              } as Option<number>)
          )}
          selectedValue={formData.country}
          onChange={handleCountryChange}
          isLoading={false}
          placeholder="Selecciona un país"
          error={errors}
          errorKey="country"
          disabled={formData.elements.length > 0}
        />
      </div>

      {showAddElementButton && (
        <Button
          success
          onClick={handleOpenTypeModal}
          className="mt-2 px-4 py-2 rounded-md"
          icon={<FaPlus />}
        >
          Agregar elemento
        </Button>
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
            <Select
              options={types?.map(
                (type) =>
                  ({
                    label: type.name,
                    value: type.id,
                  } as Option<number>)
              )}
              selectedValue={selectedType}
              onChange={handleSelectedType}
              isLoading={false}
              placeholder="Selecciona un tipo"
              error={elementTypeErrors}
              errorKey="type"
            />
          </div>
          <div className="mt-4">
            <Select
              options={subTypes?.map(
                (subType) =>
                  ({
                    label: subType.name,
                    value: subType.id,
                  } as Option<number>)
              )}
              selectedValue={selectedSubType}
              onChange={handleSubTypeChange}
              isLoading={isLoadingSubTypes}
              placeholder="Selecciona un sub tipo"
              error={elementTypeErrors}
              errorKey="subType"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              success
              onClick={handleShowAddElement}
              className="mr-2 px-4 py-2 rounded-md"
              icon={<FaPlus />}
            >
              Agregar
            </Button>
            <Button
              cancel
              onClick={handleCancelAddElement}
              className="mr-2 px-4 py-2 rounded-md"
              icon={<FaTimes />}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {showAddElement && (baseFields || editingElement !== null) && (
        <ElementForm
          baseFieldsValue={baseFields}
          handleAddElementToNorm={handleAddElementToNorm}
          handleUpdateElementNorm={handleUpdateElementNorm}
          countryCode={countryCode}
          normData={formData}
          subTypeCode={subTypeCode}
        />
      )}
      <h2 className="mt-5 font-bold text-xl">Elementos que podrías cargar</h2>
      <DataTable
        data={elementsByFilters ?? []}
        setBaseFields={setBaseFields}
        setSelectedSubType={setSelectedSubType}
      />
      {showErrorAlert && (
        <Alert message="Ha ocurrido un error al cargar los datos" error />
      )}
    </>
  );
};

export default NormForm;
