import { useCallback, useEffect, useState } from "react";
import {
  toCamelCase,
  validateNumberField,
  validateStringField,
} from "../../commons/functions";
import { ElementValue, NormData, NormElement } from "../../pages/NormPage";
import Accesories from "./Accesories";
import AccesoriesTable from "./AccesoriesTable";
import {
  Accessory,
  SemiFinishedType,
  SpecialItem,
  SubType,
} from "../../commons/types";
import Button from "../core/Button";
import { FaPlus, FaTimes } from "react-icons/fa";
import SemiFinished from "./SemiFinished";
import RadioGroup, { RadioOption } from "../core/RadioGroup";
import { SpecificationEnum } from "../../commons/enums";
import SpecialSpecification from "./SpecialSpecification";
import EditableInput from "../core/EditableInput";
import TooltipGeneral from "../core/TooltipGeneral";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useNorm } from "../../hooks/useNorm";
import Stepper from "../core/Stepper";
import YesNoRadio from "../core/YesNoRadio";
import CheckboxList from "../core/CheckboxList";
import { Modal } from "../core/Modal";
import { AppDispatch, subTypeApi } from "../../store";
import { useDispatch } from "react-redux";
import { FileUpload } from "../core/FileUpload";

export interface FormData {
  customFields: ElementValue[];
}

interface MatchedChild {
  id: string;
  description: string;
  reference: unknown;
}

interface MatchedElement {
  id: number;
  description: string;
  children: MatchedChild[];
}

interface ElementFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseFieldsValue: Record<string, Record<string, any>> | undefined;
  handleAddElementToNorm: (element: NormElement) => void;
  handleUpdateElementNorm: (element: NormElement, index: number) => void;
  handleResetStatesAfterUpdateElementNorm: () => void;
  countryCode: string | undefined;
  normData: NormData;
  subTypeCode: string | undefined;
  subTypes: SubType[] | undefined;
}

const specificationOptions: RadioOption[] = [
  { label: "Estándar", value: SpecificationEnum.Standard },
  { label: "Especial", value: SpecificationEnum.Special },
];

const ElementForm = ({
  baseFieldsValue,
  handleAddElementToNorm,
  handleUpdateElementNorm,
  handleResetStatesAfterUpdateElementNorm,
  countryCode,
  normData,
  subTypeCode,
}: ElementFormProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentSubTypeCode, setCurrentSubTypeCode] = useState<
    string | undefined
  >(subTypeCode);
  const [accessoryModalIsOpen, setAccessoryModalIsOpen] = useState(false);
  const [fieldsUpdateModalIsOpen, setFieldsUpdateModalIsOpen] = useState(false);
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
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [selectedFieldsItems, setSelectedFieldsItems] = useState<string[]>([]);
  const [selectedSemiFinished, setSelectedSemiFinished] =
    useState<SemiFinishedType>();
  const [accessoriesData, setAccessoriesData] = useState<Accessory[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [fieldsUpdateStep, setFieldsUpdateStep] = useState(0);
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
  const [answerContinueAccesories, setAnswerContinueAccesories] =
    useState<string>("no");
  const [answerContinueAField, setAnswerContinueField] = useState<string>("no");
  const [matchedElements, setMatchedElements] = useState<MatchedElement[]>([]);
  const dispatch = useDispatch<AppDispatch>();

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
      const currentElement = normData.elements[editingElement];
      const currentValues = currentElement.values;
      setCurrentSubTypeCode(currentElement.subTypeCode);
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

  const handleAnswerContinueAccesory = (value: string) => {
    setAnswerContinueAccesories(value);
  };

  const handleAnswerContinueField = (value: string) => {
    setAnswerContinueField(value);
  };

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
    generateValue();
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

  const toogleFieldsUpdateModal = () =>
    setFieldsUpdateModalIsOpen(!fieldsUpdateModalIsOpen);

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
    // if (selectedSubItems.length > 0) {
    //   set
    //   setAccesoriesError("");
    // } else {
    //   setAccesoriesError("Debes seleccionar al menos un accesorio.");
    // }
    setStep((prevStep) => prevStep + 1);
  };

  const handleNextStepFieldsUpdate = () => {
    setFieldsUpdateStep((prevStep) => prevStep + 1);
  };

  const handleCancelFieldStepper = () => {
    toogleFieldsUpdateModal();
    setAnswerContinueField("no");
    setFieldsUpdateStep(0);
  };

  const addAccessoryToElement = (
    elements: NormElement[],
    newAccessory: object
  ) => {
    selectedElements.forEach((elementId) => {
      const element = elements.find((el) => el.sapReference === elementId);

      if (!element) return;

      const accessoriesField = element.values.find(
        (v) => v.key === "accesories"
      );

      if (accessoriesField) {
        if (Array.isArray(accessoriesField.value)) {
          const exists = accessoriesField.value.some(
            (acc) => JSON.stringify(acc) === JSON.stringify(newAccessory)
          );
          if (!exists) {
            accessoriesField.value = [...accessoriesField.value, newAccessory];
          }
        }
      } else {
        element.values.push({
          key: "accesories",
          name: "Accesorios",
          sapReference: false,
          validations: {},
          descriptionInfo: "Accesorios del elemento",
          value: [newAccessory],
          type: "object",
        });
      }
    });
  };

  const handleUpdateFieldsInElements = () => {
    if (answerContinueAField === "no") {
      handleUpdateCurrentEditingElement();
    } else {
      handleUpdateCurrentEditingElement();
      const result = selectedFieldsItems
        .filter(
          (item): item is string =>
            typeof item === "string" && item.includes("-")
        )
        .map((str) => {
          const [key, elementStr, ...rest] = str.split("-");
          const type = rest.pop();
          const rawValue = rest.join("-");

          const element = Number(elementStr);
          let value: unknown;

          switch (type) {
            case "number":
              value = Number(rawValue);
              break;
            case "boolean":
              value = rawValue === "true";
              break;
            case "date":
              value = new Date(rawValue);
              break;
            case "file":
            case "text":
            case "string":
            default:
              value = rawValue;
          }

          return {
            key,
            value,
            element,
          };
        });

      result.forEach((item) => {
        const element = normData.elements[item.element];
        const field = element.values.find((f) => f.key === item.key);
        if (field) {
          field.value = item.value;
        }
        const updatedElements = normData.elements.map((el, index) => {
          if (index === item.element) {
            return {
              ...el,
              values: el.values.map((f) =>
                f.key === item.key ? { ...f, value: item.value } : f
              ),
            } as NormElement;
          }
          return el;
        });
        handleUpdateElementNorm(updatedElements[item.element], item.element);
      });

      handleResetStatesAfterUpdateElementNorm();
    }
  };

  const handleAddAccesory = () => {
    addAccessoryToElement(
      normData.elements,
      filterAccesoriesByIds(selectedSubItems)[0]
    );

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
                    ...(Array.isArray(field.value) ? field.value : []), // Accesorios existentes
                    ...filterAccesoriesByIds(selectedSubItems).filter(
                      (newAccessory) =>
                        !(field.value as object[])?.some(
                          (existing) =>
                            JSON.stringify(existing) ===
                            JSON.stringify(newAccessory)
                        )
                    ), // Solo añadir si no está duplicado
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
      setAnswerContinueAccesories("yes");
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

  const handleFileChange =
    (name: string, index?: number) => (file: File | null) => {
      console.log("file", file);
      if (index !== undefined) {
        setFormData((prevData) => {
          const updatedFields = [...prevData.customFields];
          updatedFields[index] = {
            ...updatedFields[index],
            [name]: file,
          };
          return { ...prevData, customFields: updatedFields };
        });
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

  const compareValues = (original: ElementValue[], updated: ElementValue[]) => {
    const updatedMap = new Map(updated.map((item) => [item.key, item.value]));
    const differences: { key: string; newValue: unknown; type: string }[] = [];

    for (const item of original) {
      const updatedValue = updatedMap.get(item.key);
      if (JSON.stringify(item.value) !== JSON.stringify(updatedValue)) {
        differences.push({
          key: item.key,
          newValue: updatedValue,
          type: item.type,
        });
      }
    }

    return differences;
  };

  const getMatchedElementsWithFields = async (): Promise<MatchedElement[]> => {
    const differences = compareValues(
      normData.elements[editingElement!].values,
      formData.customFields
    );

    const matchedElements: MatchedElement[] = [];

    for (const [index, element] of normData.elements.entries()) {
      if (index === editingElement) continue;

      const result = await dispatch(
        subTypeApi.endpoints.getSubTypeById.initiate(element.subType!)
      ).unwrap();

      const baseFields = result.field.base;
      const topLevelBaseKeys = Object.keys(baseFields);

      const foundKeys = element.values
        .map((value) => {
          const match = differences.find(
            (search) =>
              search.key === value.key && !topLevelBaseKeys.includes(value.key)
          );
          return match
            ? {
                id: `${value.key}-${index}-${match.newValue}-${value.type}`,
                description: value.name,
                reference: `Nuevo valor: ${match.newValue}`,
                // Maybe use some data from result here if needed
              }
            : null;
        })
        .filter(Boolean) as MatchedChild[];

      if (foundKeys.length > 0) {
        matchedElements.push({
          id: index,
          description: `Elemento ${index + 1} - ${element.subTypeName}`,
          children: foundKeys,
        });
      }
    }

    return matchedElements;
  };

  const handleUpdateCurrentEditingElement = () => {
    const passValidation = validateFormDataFields();
    if (passValidation) {
      const selectedItem = normData.elements[editingElement!];
      const element: NormElement = {
        values: formData.customFields,
        sapReference: sapRefence,
        specialItem: selectedItem.specialItem,
        subType: selectedItem.subType,
      };
      handleUpdateElementNorm(element, editingElement!);
      handleResetStatesAfterUpdateElementNorm();
      setLetterSpecification(undefined);
    }
  };

  const handleUpdateElement = async () => {
    const matchedElementsLocal = editingElement
      ? await getMatchedElementsWithFields()
      : [];

    setMatchedElements(matchedElementsLocal);

    if (matchedElementsLocal.length > 0) {
      setFieldsUpdateModalIsOpen(true);
    } else {
      handleUpdateCurrentEditingElement();
    }
  };

  const getValueFromCustomFields = useCallback(
    (key: string) => {
      const field = formData.customFields.find((field) => field.key === key);
      return field ? field.value ?? "" : "";
    },
    [formData]
  );

  const generateValue = useCallback(() => {
    return `${getValueFromCustomFields("phases")}-${getValueFromCustomFields(
      "power"
    )}-${getValueFromCustomFields("primaryVoltage")}-${getValueFromCustomFields(
      "secondaryVoltage"
    )}-${currentSubTypeCode}-${getValueFromCustomFields("connection")}-${
      normData.name
    }-${countryCode}-${getValueFromCustomFields("specification")}`;
  }, [
    currentSubTypeCode,
    normData.name,
    countryCode,
    getValueFromCustomFields,
  ]);

  const toggleElement = (id: unknown) => {
    const elementId = id as string;
    setSelectedElements((prev) =>
      prev.includes(elementId)
        ? prev.filter((subId) => subId !== elementId)
        : [...prev, elementId]
    );
  };

  const handleSelectAllElements = (selected: unknown[]) => {
    setSelectedElements(selected as string[]);
  };

  const mapElementsToCheckList = (elements: NormElement[]) => {
    let elementsTransformed = elements.map((element, index) => ({
      id: element.sapReference,
      description: `Elemento ${index + 1}`,
      reference: element.sapReference,
    }));

    if (editingElement !== null) {
      const currentElement = elements[editingElement];
      elementsTransformed = elementsTransformed.filter(
        (element) => element.reference !== currentElement.sapReference
      );
    }

    return elementsTransformed;
  };

  const stepComponents: Record<
    number,
    { title?: string; content: JSX.Element; isFinalStep?: boolean }
  > = {
    0: {
      title: "Selecciona el accesorio",
      content: (
        <Accesories
          accessoriesData={accessoriesData}
          setAccessoriesData={setAccessoriesData}
          selectedSubItems={selectedSubItems}
          setSelectedSubItems={setSelectedSubItems}
        />
      ),
      isFinalStep: false,
    },
    1: {
      title: "Selecciona el semi elaborado",
      content: (
        <SemiFinished setSelectedSemiFinished={setSelectedSemiFinished} />
      ),
      isFinalStep: false,
    },
    2: {
      title: "Deseas agregar este accesorio a más elementos?",
      content: (
        <YesNoRadio
          defaultValue={answerContinueAccesories}
          onChange={handleAnswerContinueAccesory}
          disabled={mapElementsToCheckList(normData.elements).length === 0}
        />
      ),
    },
    3: {
      content: (
        <CheckboxList
          items={mapElementsToCheckList(normData.elements)}
          selectedItems={selectedElements}
          toggleItem={toggleElement}
          labelFieldKey="description"
          additionalFieldKey="reference"
          selectAll={handleSelectAllElements}
          title="los elementos"
          multipleItems
        />
      ),
      isFinalStep: true,
    },
  };

  const findParentIds = (itemId: string): string[] => {
    const findParent = (
      items: {
        id: string;
        description: string;
        reference: string;
        children?: {
          id: string;
          description: string;
          reference: string;
        }[];
      }[],
      targetId: string,
      parentIds: string[] = []
    ): string[] => {
      for (const item of items) {
        if (item.id === targetId) {
          return parentIds;
        }

        if (item.children && item.children.length > 0) {
          const foundParentIds = findParent(item.children, targetId, [
            ...parentIds,
            item.id,
          ]);
          if (foundParentIds.length > 0) {
            return foundParentIds;
          }
        }
      }

      return [];
    };

    return findParent(matchedElements, itemId);
  };

  const toggleFields = (id: unknown) => {
    const itemId = id as string;

    setSelectedFieldsItems((prev) => {
      // If the item is already selected, just remove it
      if (prev.includes(itemId)) {
        return prev.filter((item) => item !== itemId);
      }
      // If the item is being selected, also select all parent items
      else {
        const parentIds = findParentIds(itemId);
        // Create a new array with all parent IDs and the current ID, avoiding duplicates
        const newSelected = [...new Set([...prev, ...parentIds, itemId])];
        return newSelected;
      }
    });
  };

  const handleSelectAllFields = (selected: unknown[]) => {
    setSelectedFieldsItems(selected as string[]);
  };

  const fieldsUpdateStepComponents: Record<
    number,
    { title?: string; content: JSX.Element; isFinalStep?: boolean }
  > = {
    0: {
      title:
        "Hay campos que actualizaste que estan presentes en otros elementos. Deseas seleccionar otros elementos a modificar?",
      content: (
        <YesNoRadio
          defaultValue={answerContinueAField}
          onChange={handleAnswerContinueField}
        />
      ),
      isFinalStep: false,
    },
    1: {
      content: (
        <CheckboxList
          items={matchedElements}
          selectedItems={selectedFieldsItems}
          toggleItem={toggleFields}
          labelFieldKey="description"
          additionalFieldKey="reference"
          childrenKey={"children"}
          selectAll={handleSelectAllFields}
          title="los campos"
          multipleItems
        />
      ),
      isFinalStep: true,
    },
  };

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
                  <FileUpload
                    onFileSelect={handleFileChange("value", index)}
                    showUploadButton={false}
                    accept="image/*,application/pdf,.docx"
                    maxSize={10 * 1024 * 1024}
                    {...(field.value !== null && field.value !== ""
                      ? field.value instanceof File
                        ? { initialFile: field.value }
                        : {
                            existingFileUrl: `http://localhost:3000/${field.value}`,
                          }
                      : {})}
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
                ) : field.type === "number" ? (
                  <input
                    type={field.type}
                    name="value"
                    placeholder="Ingrese un valor"
                    value={field.value as number}
                    onChange={(e) => handleChange(e, index)}
                    className={`block w-full rounded-md border focus:outline-none focus:ring-2 shadow-sm p-3 mt-5 ${
                      errors[index]
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-blue-500"
                    }`}
                  />
                ) : (
                  <input
                    type={field.type}
                    name="value"
                    placeholder="Ingrese un valor"
                    value={
                      field.type === "string" || typeof field.value === "string"
                        ? (field.value as string)
                        : ""
                    }
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
        onClose={closeModal}
        title="Agregar un nuevo campo"
      >
        <>
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
        </>
      </Modal>

      <Modal
        isOpen={accessoryModalIsOpen}
        onClose={toogleAccessoryModal}
        title="Agregar accesorio"
      >
        <Stepper
          step={step}
          stepComponents={stepComponents}
          errorMessage={accesoriesError}
          onNextStep={handleNextStep}
          onFinalAction={handleAddAccesory}
          onCancel={handleCancel}
          finishFlow={answerContinueAccesories === "no" && step === 2}
        />
      </Modal>

      <Modal
        isOpen={fieldsUpdateModalIsOpen}
        onClose={toogleFieldsUpdateModal}
        title="Actualizar campo en elementos"
        size="xl"
      >
        <Stepper
          step={fieldsUpdateStep}
          stepComponents={fieldsUpdateStepComponents}
          onNextStep={handleNextStepFieldsUpdate}
          onFinalAction={handleUpdateFieldsInElements}
          onCancel={handleCancelFieldStepper}
          finishFlow={answerContinueAField === "no" && fieldsUpdateStep === 0}
        />
      </Modal>
    </div>
  );
};

export default ElementForm;
