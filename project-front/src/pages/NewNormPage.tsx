import { useEffect, useState } from "react";
import NormForm from "../components/norms/NormForm";
import { useGetCountriesQuery, useGetTypesWithFieldsQuery } from "../store";
import NormInformation from "../components/norms/NormInformation";
import Alert from "../components/core/Alert";
import { useGetElementsByFiltersQuery } from "../store/apis/elementApi";

export interface ElementValue {
  name: string;
  value: string | File;
  type: string;
  key: string;
}
export interface NormElement {
  values: ElementValue[];
  type?: number;
}

export interface NormData {
  name: string;
  version: string;
  country: string;
  elements: NormElement[];
}

const NewNormPage = () => {
  const [formData, setFormData] = useState<NormData>({
    name: "",
    version: "",
    country: "",
    elements: [],
  });

  const {
    data: countries,
    error: errorCountries,
    isLoading: isLoadingCountries,
  } = useGetCountriesQuery(null);

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
    country: Number(formData.country),
    name: formData.name,
  });

  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    if (errorCountries || errorTypes || errorElementsByFilters) {
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000); // Hide after 3 seconds
    }
  }, [errorCountries, errorTypes, errorElementsByFilters]);

  if (isLoadingCountries) {
    return <div>Loading countries...</div>;
  }

  if (isLoadingTypes) {
    return <div>Loading types...</div>;
  }

  if (isLoadingElementsByFilters) {
    return <div>Loading elements by filters...</div>;
  }

  return (
    <div>
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
    </div>
  );
};

export default NewNormPage;
