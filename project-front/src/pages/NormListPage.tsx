import { useState } from "react";
import CardList from "../components/core/CardList";
import { useNavigate } from "react-router-dom";
import { useGetNormsPaginatedQuery } from "../store/apis/normApi";
import Select, { Option } from "../components/core/Select";
import { useGetCountriesQuery } from "../store";
import NoData from "../components/core/NoData";
import CustomInput from "../components/core/CustomInput";
import Pagination from "../components/core/Pagination";

const NormListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [name, setName] = useState<string>("");
  const [country, setCountry] = useState<number>();

  const { data, error, isLoading } = useGetNormsPaginatedQuery({
    page,
    limit,
    name: name || undefined,
    country: country || undefined,
  });

  const { data: countries, isLoading: isLoadingCountries } =
    useGetCountriesQuery(null);

  if (isLoadingCountries) {
    return <div>Loading countries...</div>;
  }
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const handleAddNormClick = () => {
    navigate("/norms/new");
  };

  const handleCountryChange = (countryId: number | undefined) => {
    setCountry(countryId);
  };

  return (
    <>
      <div className="mt-10 flex flex-col justify-center items-center my-10">
        <div className="flex justify-between min-w-[30rem]">
          <h1 className="text-3xl font-semibold text-center mb-4">
            Listado de normas
          </h1>
          <button
            className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md mb-4 ml-6"
            onClick={handleAddNormClick}
          >
            Agregar norma
          </button>
        </div>
        <h3 className="font-bold">Filtros</h3>
        <div className="flex justify-between justify-items-center align-middle min-w-[26rem] mb-5">
          <CustomInput
            type="text"
            value={name}
            onChange={setName}
            placeholder="Buscar por nombre"
            className="mt-4"
          />
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
            placeholder="Selecciona un país"
            errorKey="country"
          />
        </div>

        {data?.data.length === 0 ? (
          <NoData
            className="w-1/2 bg-gray-400"
            message="No hay resultados para mostrar."
          />
        ) : (
          <CardList items={data?.data} />
        )}

        {data && data.data.length > 0 && (
          <div className="flex align-middle mx-auto mt-4 text-2xl space-x-2">
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default NormListPage;
