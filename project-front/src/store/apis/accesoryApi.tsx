import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Accessory, GetAccesoryByNameParams } from "../../commons/types";

const accesoryApi = createApi({
  reducerPath: "accesoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL,
  }),
  endpoints: (builder) => ({
    getAccesoriesByName: builder.mutation<Accessory[], GetAccesoryByNameParams>(
      {
        query: (normData) => ({
          url: "/accesory/by-name",
          method: "POST",
          body: normData,
        }),
      }
    ),
  }),
});

export const { useGetAccesoriesByNameMutation } = accesoryApi;
export { accesoryApi };
