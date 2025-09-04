import { useState } from "react";
import {
  useGetCountriesQuery,
  useLazyGetElementsByFiltersPaginatedQuery,
} from "../store";
import Select, { Option } from "../components/core/Select";
import CustomInput from "../components/core/CustomInput";
import { useGetAllSubTypesQuery } from "../store";
import NoData from "../components/core/NoData";
import Pagination from "../components/core/Pagination";
import Button from "../components/core/Button";
import { BiSearch } from "react-icons/bi";
import { MdCleaningServices, MdRemoveCircleOutline } from "react-icons/md";
import ElementCard from "../components/elements/ElementCard";
import { ElementResponse } from "../commons/types";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Alert from "../components/core/Alert";
import { useErrorAlert } from "../hooks/useAlertError";
import FilterSkeleton from "../components/core/skeletons/FiltersSkeleton";

const DesignPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [name, setName] = useState<string>("");
  const [country, setCountry] = useState<number>();
  const [subType, setSubType] = useState<string>();
  const [sapReference, setSapReference] = useState<string>("");
  const [selectedElements, setSelectedElements] = useState<ElementResponse[]>(
    []
  );

  const {
    data: countries,
    isLoading: isLoadingCountries,
    error: errorCountries,
  } = useGetCountriesQuery(null);

  const {
    data: subTypes,
    isLoading: isLoadingSubTypes,
    error: errorSubTypes,
  } = useGetAllSubTypesQuery();

  const [
    trigger,
    { data: elements, error: errorElements, isLoading: isLoadingElements },
  ] = useLazyGetElementsByFiltersPaginatedQuery();

  const { showErrorAlert, errorMessages, setShowErrorAlert } = useErrorAlert({
    "Error obteniendo países": errorCountries,
    "Error obteniendo subtipos": errorSubTypes,
    "Error obteniendo elementos": errorElements,
  });

  const handleSearchClick = () => {
    setSelectedElements([]);
    trigger({
      page,
      limit,
      name: name || undefined,
      country: country || undefined,
      subType: subType || undefined,
      sapReference: sapReference || undefined,
    });
  };

  const handleCountryChange = (countryId: number | undefined) => {
    setCountry(countryId);
  };

  const handleSubTypeChange = (subTypeName: string | undefined) => {
    setSubType(subTypeName);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    trigger({
      page: newPage,
      limit,
      name: name || undefined,
      country: country || undefined,
      subType: subType || undefined,
      sapReference: sapReference || undefined,
    });
  };

  const handleCleanFilters = () => {
    setSelectedElements([]);
    setName("");
    setCountry(undefined);
    setSubType(undefined);
    setSapReference("");
    trigger({
      page: 1,
      limit,
      name: undefined,
      country: undefined,
      subType: undefined,
      sapReference: undefined,
    });
  };

  const handleElementCheck = (element: ElementResponse, isChecked: boolean) => {
    if (isChecked) {
      setSelectedElements((prev) => [...prev, element]);
    } else {
      setSelectedElements((prev) =>
        prev.filter((item) => item.id !== element.id)
      );
    }
  };

  const handleDeleteSelected = () => {
    setSelectedElements([]);
  };

  const handleContinueWithSelected = () => {
    const selectedIds = selectedElements.map((el) => el.id).join(",");
    navigate(`/elements/design?ids=${selectedIds}`);
  };

  return (
    <>
      <div className="mt-10 flex flex-col justify-center items-center my-10 mx-10">
        <h1 className="text-3xl font-semibold text-center mb-4">
          Diseño de elementos
        </h1>
        <h2>Buscar el o los elementos para agregar diseños</h2>
        <h3 className="font-bold mt-5">Filtros</h3>
        {isLoadingCountries || isLoadingSubTypes ? (
          <div className="flex justify-between justify-items-center align-middle min-w-[70rem] mb-5">
            <FilterSkeleton />
          </div>
        ) : (
          <div className="flex justify-between justify-items-center align-middle min-w-[70rem] mb-5">
            <Select
              options={countries?.map(
                (country) =>
                  ({
                    label: country.name,
                    value: country.id,
                  } as Option<number>)
              )}
              selectedValue={country}
              onChange={handleCountryChange}
              isLoading={false}
              placeholder="País"
              errorKey="country"
            />
            <CustomInput
              type="text"
              value={name}
              onChange={setName}
              placeholder="Nombre norma"
              className="mt-4"
            />
            <CustomInput
              type="text"
              value={sapReference}
              onChange={setSapReference}
              placeholder="Referencia SAP"
              className="mt-4"
            />
            <Select
              options={subTypes?.map(
                (subType) =>
                  ({
                    label: subType.name,
                    value: subType.name,
                  } as Option<string>)
              )}
              selectedValue={subType}
              onChange={handleSubTypeChange}
              isLoading={false}
              placeholder="Subtipo"
              errorKey="country"
            />
            <Button
              primary
              loading={isLoadingElements}
              onClick={handleSearchClick}
              icon={<BiSearch />}
              className="mt-4"
            >
              Buscar
            </Button>
            <Button
              baseFill
              onClick={handleCleanFilters}
              icon={<MdCleaningServices />}
              className="mt-4"
            >
              Limpiar Filtros
            </Button>
          </div>
        )}

        {selectedElements.length > 0 && (
          <div className="flex justify-between justify-items-center align-middle">
            <Button
              onClick={handleContinueWithSelected}
              className="mb-5"
              icon={<IoIosAddCircleOutline />}
              success
            >
              Agregar diseño(s)
            </Button>
            <Button
              onClick={handleDeleteSelected}
              className="mb-5 ml-2"
              icon={<MdRemoveCircleOutline />}
              danger
            >
              Quitar seleccionados ({selectedElements.length})
            </Button>
          </div>
        )}
        {elements?.data.length === 0 ? (
          <NoData
            className="w-1/2 bg-gray-400"
            message="No hay resultados para mostrar."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full">
            {elements?.data.map((element) => (
              <ElementCard
                key={element.id}
                element={element}
                onCheckChange={handleElementCheck}
                isChecked={selectedElements.some(
                  (item) => item.id === element.id
                )}
              />
            ))}
          </div>
        )}
        {elements && elements.data.length > 0 && (
          <div className="flex align-middle mx-auto mt-4 text-2xl space-x-2">
            <Pagination
              currentPage={page}
              totalPages={elements.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
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

export default DesignPage;
