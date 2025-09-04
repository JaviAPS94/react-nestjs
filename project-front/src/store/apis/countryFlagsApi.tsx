import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CountryFlagsData } from "../../commons/types";

const countriesFlagsApi = createApi({
  reducerPath: "countriesFlagsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://restcountries.com/v3.1/" }),
  endpoints: (builder) => ({
    getCountryFlagByCode: builder.query<CountryFlagsData[], string>({
      query: (isoCode) => `alpha/${isoCode}`,
    }),
  }),
});

export const { useGetCountryFlagByCodeQuery } = countriesFlagsApi;
export { countriesFlagsApi };
