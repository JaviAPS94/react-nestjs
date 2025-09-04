import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  NormCompleteData,
  NormPaginated,
  NormPaginatedParams,
  Specification,
} from "../../commons/types";

const normApi = createApi({
  reducerPath: "normApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL,
  }),
  tagTypes: ["Norm"],
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
      invalidatesTags: ["Norm"],
    }),
    getSpecifications: builder.query<Specification[], null>({
      query: () => "/norm/specifications",
    }),
    getNormsPaginated: builder.query<NormPaginated, NormPaginatedParams>({
      query: ({ page = 1, limit = 10, name, country }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (name) params.append("name", name);
        if (country) params.append("country", country.toString());

        return `/norm/all-paginated?${params.toString()}`;
      },
      providesTags: ["Norm"],
    }),
    getNormById: builder.query<NormCompleteData, number | undefined>({
      query: (id) => `/norm/${id}`,
      providesTags: ["Norm"],
    }),
  }),
});

export const {
  useSaveNormMutation,
  useGetSpecificationsQuery,
  useGetNormsPaginatedQuery,
  useGetNormByIdQuery,
} = normApi;
export { normApi };
