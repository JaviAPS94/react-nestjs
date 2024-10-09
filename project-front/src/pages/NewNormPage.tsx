import { useEffect, useState } from "react";
import NormForm from "../components/norms/NormForm";
import { useGetCountriesQuery, useGetTypesWithFieldsQuery } from "../store";
import NormInformation from "../components/norms/NormInformation";

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

  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    if (errorCountries || errorTypes) {
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000); // Hide after 3 seconds
    }
  }, [errorCountries, errorTypes]);

  if (isLoadingCountries) {
    return <div>Loading countries...</div>;
  }

  if (isLoadingTypes) {
    return <div>Loading types...</div>;
  }

  return (
    <div>
      <h1 className="font-bold text-2xl my-10 text-center">
        GENERAR NUEVA NORMA
      </h1>
      <div className="mx-10">
        <div className="flex h-screen">
          <div className="w-1/2 p-8 overflow-auto">
            <NormForm
              countries={countries}
              types={types}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
          <div className="w-1/2 p-8 bg-white overflow-auto">
            <NormInformation formData={formData} setFormData={setFormData} />
          </div>
        </div>
      </div>
      {showErrorAlert && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Error loading countries!
        </div>
      )}
    </div>
  );
};

export default NewNormPage;
