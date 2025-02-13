import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Specification } from "../../commons/types";

const normApi = createApi({
  reducerPath: "normApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL,
  }),
  endpoints: (builder) => ({
    saveNorm: builder.mutation<null, FormData>({
      query: (normData) => ({
        url: "/norm",
        method: "POST",
        body: normData,
        headers: {
          "Content-Type": undefined,
        },
      }),
    }),
    getSpecifications: builder.query<Specification[], null>({
      query: () => "/norm/specifications",
    }),
  }),
});

export const { useSaveNormMutation, useGetSpecificationsQuery } = normApi;
export { normApi };
