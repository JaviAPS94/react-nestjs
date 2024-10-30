import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
          // Avoid setting 'Content-Type' explicitly, or set it to undefined
          "Content-Type": undefined,
        },
      }),
    }),
  }),
});

export const { useSaveNormMutation } = normApi;
export { normApi };
