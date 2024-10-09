import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { NormData } from "../../pages/NewNormPage";

const normApi = createApi({
  reducerPath: "normApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL,
  }),
  endpoints: (builder) => ({
    saveNorm: builder.mutation<null, NormData>({
      query: (normData) => ({
        url: "/norm",
        method: "POST",
        body: normData,
      }),
    }),
  }),
});

export const { useSaveNormMutation } = normApi;
export { normApi };
