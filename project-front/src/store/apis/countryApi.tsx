import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Country } from "../../commons/types";

const countryApi = createApi({
  reducerPath: "countryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL,
  }),
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], null>({
      query: () => ({
        url: "/countries",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCountriesQuery } = countryApi;
export { countryApi };
