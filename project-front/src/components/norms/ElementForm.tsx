import { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import {
  toCamelCase,
  validateNumberField,
  validateStringField,
} from "../../commons/functions";
import { ElementValue, NormData, NormElement } from "../../pages/NewNormPage";
import Accesories from "./Accesories";
import AccesoriesTable from "./AccesoriesTable";
import { Accessory, SemiFinishedType, SpecialItem } from "../../commons/types";
import Button from "../core/Button";
import { FaChevronRight, FaPlus, FaTimes } from "react-icons/fa";
import SemiFinished from "./SemiFinished";
import RadioGroup, { RadioOption } from "../core/RadioGroup";
import { SpecificationEnum } from "../../commons/enums";
import SpecialSpecification from "./SpecialSpecification";
import EditableInput from "../core/EditableInput";
import TooltipGeneral from "../core/TooltipGeneral";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useNorm } from "../../hooks/useNorm";

export interface FormData {
  customFields: ElementValue[];
}

interface ElementFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseFieldsValue: Record<string, Record<string, any>> | undefined;
  handleAddElementToNorm: (element: NormElement) => void;
  handleUpdateElementNorm: (element: NormElement) => void;
  countryCode: string | undefined;
  normData: NormData;
  subTypeCode: string | undefined;
}

const specificationOptions: RadioOption[] = [
  { label: "Estándar", value: SpecificationEnum.Standard },
  { label: "Especial", value: SpecificationEnum.Special },
];

const ElementForm = ({
  baseFieldsValue,
  handleAddElementToNorm,
  handleUpdateElementNorm,
  countryCode,
  normData,
  subTypeCode,
}: ElementFormProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [accessoryModalIsOpen, setAccessoryModalIsOpen] = useState(false);
  const [newField, setNewField] = useState<Omit<ElementValue, "value">>({
    name: "",
    type: "text",
    key: "",
    sapReference: false,
    validations: {},
    descriptionInfo: "",
  });
  const { editingElement, handleDisableEdit } = useNorm();
  const [formData, setFormData] = useState<FormData>({
    customFields:
      editingElement !== null ? normData.elements[editingElement].values : [],
  });
  const [selectedSubItems, setSelectedSubItems] = useState<number[]>([]);
  const [selectedSemiFinished, setSelectedSemiFinished] =
    useState<SemiFinishedType>();
  const [accessoriesData, setAccessoriesData] = useState<Accessory[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [accesoriesError, setAccesoriesError] = useState<string>("");
  const [newFieldError, setNewFieldError] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>(
    SpecificationEnum.Standard
  );
  const [selectedSpecification, setSelectedSpecification] = useState<
    SpecialItem | undefined
  >();
  const [letterSpecification, setLetterSpecification] = useState<
    string | undefined
  >();
  const [sapRefence, setSapReference] = useState("");

  useEffect(() => {
    const initializeCustomFields = () => {
      const base = baseFieldsValue;
      const customFields = base
        ? [
            ...Object.entries(base).map(([key, value]) => ({
              key,
              name: value.label,
              value: value.value,
              type: value.type,
              sapReference: value.sapReference,
              validations: value.validations,
              descriptionInfo: value.descriptionInfo,
            })),
            {
              name: "Especificación",
              type: "string",
              value: SpecificationEnum.Standard,
              key: toCamelCase("specification"),
              sapReference: true,
              validations: {},
              descriptionInfo:
                "Especifica si el elemento es estándar o especial",
            },
          ]
        : [
            {
              name: "Especificación",
              type: "string",
              value: SpecificationEnum.Standard,
              key: toCamelCase("specification"),
              sapReference: true,
              validations: {},
              descriptionInfo:
                "Especifica si el elemento es estándar o especial",
            },
          ];

      setFormData((prevData) => ({
        ...prevData,
        customFields,
      }));
    };

    if (editingElement === null) {
      initializeCustomFields();
    } else {
      const currentValues = normData.elements[editingElement].values;
      setFormData((prevData) => ({
        ...prevData,
        customFields: currentValues,
      }));
      const specification = currentValues.find(
        (field) => field.key === "specification"
      );
      if (specification?.value === SpecificationEnum.Standard) {
        setSelectedOption(SpecificationEnum.Standard);
      } else {
        setSelectedOption(SpecificationEnum.Special);
        setLetterSpecification(specification?.value as string);
      }
    }
  }, [baseFieldsValue, editingElement]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const updateCustomFieldValue = (
    key: string,
    newValue: string | File | object
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      customFields: prevState.customFields.map((field) =>
        field.key === key ? { ...field, value: newValue } : field
      ),
    }));
  };

  const handleSapReferenceChange = (value: string) => {
    setSapReference(value);
  };

  const handleRadioChange = (value: string) => {
    setSelectedSpecification(undefined);
    setSelectedOption(value);
    if (value == SpecificationEnum.Standard) {
      updateCustomFieldValue("specification", value);
    }
  };

  const handleNewFieldCancel = () => {
    setNewField({
      name: "",
      type: "text",
      key: "",
      sapReference: false,
      validations: {},
      descriptionInfo: "",
    });
    setNewFieldError("");
    closeModal();
  };

  const handleCancel = () => {
    toogleAccessoryModal();
    setSelectedSubItems([]);
    setAccessoriesData([]);
    setAccesoriesError("");
    setStep(0);
  };

  const toogleAccessoryModal = () =>
    setAccessoryModalIsOpen(!accessoryModalIsOpen);

  const handleAddField = () => {
    if (newField.name && newField.type) {
      setFormData((prevData) => ({
        ...prevData,
        customFields: [
          ...prevData.customFields,
          { ...newField, value: "", key: toCamelCase(newField.name) },
        ],
      }));
      setNewField({
        name: "",
        type: "text",
        key: "",
        sapReference: false,
        validations: {},
        descriptionInfo: "",
      });
      setNewFieldError("");
      closeModal();
    } else {
      setNewFieldError("Debes llenar el nombre del campo.");
    }
  };

  const filterAccesoriesByIds = (ids: number[]): Accessory[] => {
    const filteredAccesories = accessoriesData
      .filter((subItem) => ids.includes(subItem.id))
      .map((subItem, index) => {
        if (index === 0) {
          return { ...subItem, semiFinished: selectedSemiFinished };
        }
        return subItem;
      });
    return filteredAccesories;
  };

  const handleNextStep = () => {
    if (selectedSubItems.length > 0) {
      setStep(1);
      setAccesoriesError("");
    } else {
      setAccesoriesError("Debes seleccionar al menos un accesorio.");
    }
  };

  const handleAddAccesory = () => {
    if (selectedSubItems.length > 0 && selectedSemiFinished) {
      setFormData((prevData) => ({
        ...prevData,
        customFields: prevData.customFields
          .map((field) =>
            field.key === "accesories"
              ? {
                  ...field,
                  name: "Accesorios",
                  value: [
                    ...new Set([
                      ...(Array.isArray(field.value) ? field.value : []),
                      ...filterAccesoriesByIds(selectedSubItems),
                    ]),
                  ],
                  type: "object",
                }
              : field
          )
          .concat(
            prevData.customFields.some((field) => field.key === "accesories")
              ? []
              : [
                  {
                    key: "accesories",
                    name: "Accesorios",
                    value: filterAccesoriesByIds(selectedSubItems),
                    type: "object",
                    sapReference: false,
                    validations: {},
                    descriptionInfo: "Accesorios del elemento",
                  },
                ]
          ),
      }));
      toogleAccessoryModal();
      setSelectedSubItems([]);
      setAccessoriesData([]);
      setStep(0);
      setSelectedSemiFinished(undefined);
    } else {
      setAccesoriesError("Debes seleccionar al menos un semi elaborado.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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

  const validateFormDataFields = () => {
    const newErrors: Record<string, string> = {};

    formData.customFields.forEach((field, index) => {
      if (field.value === undefined || field.value === null) {
        newErrors[index] = "Este campo es obligatorio, debes llenarlo.";
      } else if (typeof field.value === "string" && field.value.trim() === "") {
        newErrors[index] = "Este campo no puede ser vacío.";
      } else if (
        field.type === "file" &&
        field.value instanceof File &&
        !field.value.name
      ) {
        newErrors[index] = "Por favor selecciona un archivo.";
      } else if (
        field.type === "object" &&
        Object.keys(field.value || {}).length === 0
      ) {
        newErrors[index] = "Este campo no puede ser vacío.";
      }

      //Validations from DB
      if (field.type === "number" && field.validations) {
        const errors = validateNumberField(
          field.name,
          Number(field.value),
          field.validations
        );
        if (errors.length > 0) {
          newErrors[index] = errors.join(" ");
        }
      }

      if (field.type === "string" && field.validations) {
        const errors = validateStringField(
          field.name,
          field.value as string,
          field.validations
        );
        if (errors.length > 0) {
          newErrors[index] = errors.join(" ");
        }
      }
    });

    if (selectedOption === SpecificationEnum.Special) {
      if (!selectedSpecification) {
        newErrors["specialItem"] = "Debes seleccionar una especificación.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInsertElement = () => {
    const passValidation = validateFormDataFields();

    if (passValidation) {
      const element: NormElement = {
        values: formData.customFields,
        sapReference: sapRefence,
      };
      if (selectedOption === SpecificationEnum.Special) {
        element.specialItem = selectedSpecification?.id;
      }
      handleAddElementToNorm(element);
      handleDisableEdit(false);
    }
  };

  const handleUpdateElement = () => {
    const passValidation = validateFormDataFields();
    if (passValidation) {
      const selectedItem = normData.elements[editingElement!];
      const element: NormElement = {
        values: formData.customFields,
        sapReference: sapRefence,
        specialItem: selectedItem.specialItem,
        subType: selectedItem.subType,
      };
      handleUpdateElementNorm(element);
      setLetterSpecification(undefined);
    }
  };

  const getValueFromCustomFields = useCallback(
    (key: string) => {
      const field = formData.customFields.find(
        (field) => field.key === key && field.sapReference
      );
      return field ? field.value ?? "" : "";
    },
    [formData.customFields]
  );

  const generateValue = useCallback(() => {
    return `${getValueFromCustomFields("phases")}-${getValueFromCustomFields(
      "power"
    )}-${getValueFromCustomFields("primaryVoltage")}-${getValueFromCustomFields(
      "secondaryVoltage"
    )}-${subTypeCode}-${getValueFromCustomFields("connection")}-${
      normData.name
    }-${countryCode}-${getValueFromCustomFields("specification")}`;
  }, [subTypeCode, normData.name, countryCode, getValueFromCustomFields]);

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center py-5">
        <h2 className="text-xl font-bold">Información del elemento</h2>
        <div className="flex">
          <Button
            success
            onClick={toogleAccessoryModal}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            icon={<FaPlus />}
          >
            Agregar accesorio
          </Button>
          <Button
            success
            onClick={openModal}
            className="mt-2 ml-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            icon={<FaPlus />}
          >
            Agregar campo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formData.customFields.map(
          (field, index) =>
            field.key != "specification" && (
              <div
                key={index}
                className={
                  field.type === "object" ? "col-span-2" : "col-span-1"
                }
              >
                <div className="flex items-center">
                  <label className="block font-bold mr-2">{field.name}</label>
                  <TooltipGeneral
                    content={field.descriptionInfo}
                    position="right"
                    delay={100}
                  >
                    <IoIosInformationCircleOutline className="text-blue-500 text-xl" />
                  </TooltipGeneral>
                </div>

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
                ) : field.type === "object" ? (
                  <div className="container mx-auto mt-5">
                    <AccesoriesTable
                      accessories={
                        typeof field.value === "string"
                          ? (JSON.parse(field.value) as Accessory[])
                          : (field.value as Accessory[])
                      }
                      setFormData={setFormData}
                      showDelete
                    />
                  </div>
                ) : (
                  <input
                    type={field.type}
                    name="value"
                    placeholder="Ingrese un valor"
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(e) => handleChange(e, index)}
                    className={`block w-full rounded-md border focus:outline-none focus:ring-2 shadow-sm p-3 mt-5 ${
                      errors[index]
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-blue-500"
                    }`}
                  />
                )}
                {errors[index] && (
                  <span className="text-red-500 text-sm">{errors[index]}</span>
                )}
              </div>
            )
        )}
      </div>

      <div className="py-4">
        <h1 className="text-lg font-bold mb-4">Selecciona la especificación</h1>
        <RadioGroup
          options={specificationOptions}
          name="radio-specifcation"
          selectedValue={selectedOption}
          onChange={handleRadioChange}
        />
        {selectedOption === SpecificationEnum.Special && (
          <SpecialSpecification
            selectedSpecification={selectedSpecification}
            setSelectedSpecification={setSelectedSpecification}
            errors={errors}
            updateCustomFieldValue={updateCustomFieldValue}
            initialSelectedSpecification={letterSpecification}
          />
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold">Referencia SAP</h2>
        <EditableInput
          initialValue={generateValue()}
          name="sapReference"
          placeholder="Ingrese un valor"
          onValueChange={handleSapReferenceChange}
        />
      </div>

      {editingElement !== null ? (
        <div className="mt-4">
          <Button
            primary
            onClick={handleUpdateElement}
            className="px-4 py-2 rounded-md"
            icon={<FaPlus />}
          >
            Guardar cambios
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <Button
            primary
            onClick={handleInsertElement}
            className="px-4 py-2 rounded-md"
            icon={<FaPlus />}
          >
            Insertar elemento a la norma
          </Button>
        </div>
      )}

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
            {newFieldError && (
              <span className="text-red-500 text-sm">{newFieldError}</span>
            )}
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
            <Button
              success
              onClick={handleAddField}
              className="mr-2 px-4 py-2 rounded-md"
              icon={<FaPlus />}
            >
              Agregar
            </Button>
            <Button
              onClick={handleNewFieldCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              icon={<FaTimes />}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={accessoryModalIsOpen}
        onRequestClose={toogleAccessoryModal}
        contentLabel="Selecciona los accesorios"
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-25"
      >
        <div className="bg-white p-6 rounded-md shadow-lg max-w-3xl w-full">
          <h2 className="text-lg font-medium">
            {
              ["Selecciona los accesorios", "Selecciona el semi elaborado"][
                step
              ]
            }
          </h2>
          <div className="mt-4 max-h-96 overflow-y-auto">
            {step === 0 && (
              <>
                <Accesories
                  accessoriesData={accessoriesData}
                  setAccessoriesData={setAccessoriesData}
                  selectedSubItems={selectedSubItems}
                  setSelectedSubItems={setSelectedSubItems}
                />
              </>
            )}
            {step === 1 && (
              <SemiFinished setSelectedSemiFinished={setSelectedSemiFinished} />
            )}
          </div>
          {accesoriesError && (
            <span className="text-red-500 text-sm">{accesoriesError}</span>
          )}
          <div className="mt-6 flex justify-center">
            <Button
              primary={step === 0}
              success={step === 1}
              onClick={step === 0 ? handleNextStep : handleAddAccesory}
              className="mr-2 text-white px-4 py-2 rounded-md"
              icon={step === 0 ? <FaChevronRight /> : <FaPlus />}
            >
              {step === 0 ? "Continuar" : "Agregar"}
            </Button>
            <Button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              icon={<FaTimes />}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ElementForm;
