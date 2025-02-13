import { useEffect, useState } from "react";
import NormForm from "../components/norms/NormForm";
import {
  useGetCountriesQuery,
  useGetSpecificationsQuery,
  useGetTypesWithFieldsQuery,
} from "../store";
import NormInformation from "../components/norms/NormInformation";
import Alert from "../components/core/Alert";
import { useGetElementsByFiltersQuery } from "../store/apis/elementApi";
import { NormProvider } from "../context/NormProvider";

export interface ElementValue {
  name: string;
  value: string | File | object;
  type: string;
  key: string;
  sapReference: boolean;
  validations: Record<string, unknown>;
  descriptionInfo: string;
}

export interface NormElement {
  values: ElementValue[];
  subType?: number;
  specialItem?: number;
  sapReference: string;
}

export interface NormData {
  name: string | undefined;
  version: string;
  country: number | undefined;
  elements: NormElement[];
}

const NewNormPage = () => {
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

  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    if (
      errorCountries ||
      errorTypes ||
      errorElementsByFilters ||
      errorSpecifications
    ) {
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
    }
  }, [errorCountries, errorTypes, errorElementsByFilters, errorSpecifications]);

  if (isLoadingCountries) {
    return <div>Loading countries...</div>;
  }

  if (isLoadingTypes) {
    return <div>Loading types...</div>;
  }

  if (isLoadingElementsByFilters) {
    return <div>Loading elements by filters...</div>;
  }

  if (isLoadingSpecifications) {
    return <div>Loading specifications...</div>;
  }

  return (
    <NormProvider>
      <h1 className="font-bold text-2xl my-10 text-center">
        GENERAR NUEVA NORMA
      </h1>
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
            <NormInformation formData={formData} setFormData={setFormData} />
          </div>
        </div>
      </div>
      {showErrorAlert && (
        <Alert message="Ha ocurrido un error al cargar los datos" error />
      )}
    </NormProvider>
  );
};

export default NewNormPage;
