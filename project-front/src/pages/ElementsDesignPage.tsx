import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "../components/core/Select";
import {
  useGetDesignTypesQuery,
  useGetDesignSubtypesByTypeIdQuery,
  useGetElementsByIdsQuery,
  useLazyGetDesignSubtypeWithFunctionsByIdQuery,
  useLazyGetTemplatesByDesignSubtypeIdQuery,
} from "../store";
import { Option } from "../components/core/Select";
import ElementCard from "../components/elements/ElementCard";
import { ElementResponse } from "../commons/types";
import SpreadSheet from "../components/design/SpreadSheet";
import { useErrorAlert } from "../hooks/useAlertError";
import Alert from "../components/core/Alert";

const ElementsDesignPage = () => {
  const [searchParams] = useSearchParams();
  const idsParam = searchParams.get("ids");
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<number | null>(null);
  const [selectedElements, setSelectedElements] = useState<ElementResponse[]>(
    []
  );
  const [elementTypeErrors, setElementTypeErrors] = useState<
    Record<string, string>
  >({});

  const ids = idsParam ? idsParam.split(",").map(Number) : [];

  const [
    trigger,
    {
      data: subTypeWithFunctions,
      error: errorSubTypeWithFunctions,
      isLoading: isLoadingSubTypeWithFunctions,
    },
  ] = useLazyGetDesignSubtypeWithFunctionsByIdQuery();

  const [
    triggerTemplates,
    {
      data: templatesData,
      error: errorTemplates,
      isLoading: isLoadingTemplates,
    },
  ] = useLazyGetTemplatesByDesignSubtypeIdQuery();

  // Fetch elements by IDs
  const {
    data: elements,
    isLoading: isLoadingElements,
    error: errorElements,
  } = useGetElementsByIdsQuery(
    {
      ids,
    },
    {
      skip: ids.length === 0,
    }
  );

  useEffect(() => {
    if (!isLoadingElements) {
      setSelectedElements(elements || []);
    }
  }, [elements, isLoadingElements]);

  // Fetch design types
  const {
    data: types,
    isLoading: isLoadingTypes,
    error: errorTypes,
  } = useGetDesignTypesQuery();

  // Fetch subtypes when a type is selected
  const {
    data: subTypes,
    isLoading: isLoadingSubTypes,
    error: errorSubTypes,
  } = useGetDesignSubtypesByTypeIdQuery(selectedType || 0, {
    skip: !selectedType,
  });

  const { showErrorAlert, errorMessages, setShowErrorAlert } = useErrorAlert({
    "Error obteniendo los tipos": errorTypes,
    "Error obteniendo subtipos": errorSubTypes,
    "Error obteniendo elementos": errorElements,
    "Error obteniendo funciones del sub tipo": errorSubTypeWithFunctions,
    "Error obteniendo plantillas": errorTemplates,
  });

  const handleElementCheck = (element: ElementResponse) => {
    if (selectedElements.length > 1) {
      setSelectedElements((prev) =>
        prev.filter((item) => item.id !== element.id)
      );
    }
  };

  // Handlers for select inputs
  const handleSelectedType = (typeId: number | undefined) => {
    setSelectedType(typeId || null);
    setSelectedSubType(null); // Reset subtype when type changes
  };

  const handleSubTypeChange = (subTypeId: number | undefined) => {
    setSelectedSubType(subTypeId || null);
    if (subTypeId) {
      trigger(subTypeId);
      triggerTemplates(subTypeId);
    }
  };

  const handleElementIsChecked = (element: ElementResponse): boolean => {
    return selectedElements.some((item) => item.id === element.id);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-center">Diseño de Elementos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full my-5">
          {selectedElements?.map((element) => (
            <ElementCard
              key={element.id}
              element={element}
              onCheckChange={handleElementCheck}
              isChecked={handleElementIsChecked(element)}
              isBlocked={selectedElements.length <= 1}
              blockedReason="Debes seleccionar al menos un elemento"
            />
          ))}
        </div>
        <h2 className="font-bold text-xl mt-4">
          Selecciona el tipo y sub tipo del diseño
        </h2>
        <div className="flex mt-4 gap-4">
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
            isLoading={isLoadingTypes}
            placeholder="Selecciona un tipo"
            error={elementTypeErrors}
            errorKey="type"
            className="w-60"
          />
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
            disabled={!selectedType}
            className="w-60"
          />
        </div>
      </div>
      {subTypeWithFunctions && templatesData && (
        <SpreadSheet
          subTypeWithFunctions={subTypeWithFunctions}
          templates={templatesData}
          elementIds={ids}
          designSubtypeId={selectedSubType}
        />
      )}
      {showErrorAlert && (
        <Alert
          messages={errorMessages}
          error
          onClose={() => setShowErrorAlert(false)}
        />
      )}
    </>
  );
};

export default ElementsDesignPage;
