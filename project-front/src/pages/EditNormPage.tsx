import { useParams } from "react-router-dom";
import {
  useGetCountriesQuery,
  useGetElementsByFiltersQuery,
  useGetNormByIdQuery,
  useGetSpecificationsQuery,
  useGetTypesWithFieldsQuery,
} from "../store";
import FormSkeleton from "../components/core/FormSkeleton";
import NormForm from "../components/norms/NormForm";
import NormInformation from "../components/norms/NormInformation";
import { useEffect, useState } from "react";
import { ElementValue, NormData, NormElement } from "./NormPage";
import { CompleteElementData, NormCompleteData } from "../commons/types";
import { NormProvider } from "../context/NormProvider";

const EditNormPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: norm, isLoading: isLoadingNorm } = useGetNormByIdQuery(+id!);

  const mapNormCompleteDataToNormData = (norm: NormCompleteData): NormData => {
    return {
      name: norm.name,
      version: norm.version,
      country: norm.country?.id, // Assuming `country` has an `id` property
      elements: norm.elements.map(mapCompleteElementDataToNormElement),
    };
  };

  const mapCompleteElementDataToNormElement = (
    element: CompleteElementData
  ): NormElement => {
    return {
      values: element.values.map(mapRecordToElementValue),
      subType: element.subType?.id,
      sapReference: element.sapReference,
    };
  };

  const mapRecordToElementValue = (
    record: Record<string, unknown>
  ): ElementValue => {
    return {
      name: (record.name as string) || "", // Ensure it is a string
      value: record.value ?? "", // Default to empty string if null/undefined
      type: (record.type as string) || "",
      key: (record.key as string) || "",
      sapReference: Boolean(record.sapReference),
      validations: (record.validations as Record<string, unknown>) || {},
      descriptionInfo: (record.descriptionInfo as string) || "",
    };
  };

  const [formData, setFormData] = useState<NormData>({
    name: "",
    version: "",
    country: undefined,
    elements: [],
  });

  const {
    data: countries,
    error: errorCountries,
    isLoading: isLoadingCountries,
  } = useGetCountriesQuery(null);

  const {
    data: specifications,
    error: errorSpecifications,
    isLoading: isLoadingSpecifications,
  } = useGetSpecificationsQuery(null);

  const {
    data: types,
    error: errorTypes,
    isLoading: isLoadingTypes,
  } = useGetTypesWithFieldsQuery(null);

  const {
    data: elementsByFilters,
    error: errorElementsByFilters,
    isLoading: isLoadingElementsByFilters,
  } = useGetElementsByFiltersQuery({
    country: formData.country || 0,
    name: formData.name,
  });

  useEffect(() => {
    if (norm) {
      setFormData(mapNormCompleteDataToNormData(norm));
    }
  }, [norm]);

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="font-bold text-2xl my-5">INFORMACIÓN DE LA NORMA</h1>
      {isLoadingNorm && (
        <div className="w-3/4 mx-auto">
          <FormSkeleton />
        </div>
      )}
      {norm && !isLoadingNorm && (
        <NormProvider>
          <div className="mx-10">
            <div className="flex h-screen">
              <div className="w-4/6 p-8 overflow-auto">
                <NormForm
                  countries={countries}
                  types={types}
                  formData={formData}
                  setFormData={setFormData}
                  elementsByFilters={elementsByFilters}
                  specifications={specifications}
                />
              </div>
              <div className="w-2/6 p-8 bg-white overflow-auto">
                <NormInformation
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>
            </div>
          </div>
        </NormProvider>
      )}
    </div>
  );
};

export default EditNormPage;
