import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ElementResponse,
  GetElementsParams,
  SpecialItem,
} from "../../commons/types";

const elementApi = createApi({
  reducerPath: "elementApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL,
  }),
  endpoints: (builder) => ({
    getElementsByFilters: builder.query<ElementResponse[], GetElementsParams>({
      query: (getElementsParams) => ({
        url: `/element/by-filters?country=${getElementsParams.country}&name=${getElementsParams.name}`,
        method: "GET",
      }),
    }),
    getSpecialItems: builder.query<SpecialItem[], null>({
      query: () => ({
        url: "/element/special-items",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetElementsByFiltersQuery, useGetSpecialItemsQuery } =
  elementApi;
export { elementApi };
