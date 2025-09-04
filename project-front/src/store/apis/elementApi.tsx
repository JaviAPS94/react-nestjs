import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ElementResponse,
  ElementsByIdsParams,
  ElementsPaginated,
  ElementsPaginatedParams,
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
    getElementsByFiltersPaginated: builder.query<
      ElementsPaginated,
      ElementsPaginatedParams
    >({
      query: (getElementsParams) => {
        const params = new URLSearchParams({
          page: getElementsParams.page.toString(),
          limit: getElementsParams.limit.toString(),
        });

        if (getElementsParams.name)
          params.append("name", getElementsParams.name);
        if (getElementsParams.country)
          params.append("country", getElementsParams.country.toString());
        if (getElementsParams.subType)
          params.append("subType", getElementsParams.subType);
        if (getElementsParams.sapReference)
          params.append("sapReference", getElementsParams.sapReference);

        return `/element/by-filters-paginated?${params.toString()}`;
      },
    }),
    getElementsByIds: builder.query<ElementResponse[], ElementsByIdsParams>({
      query: (elementsByIdsParams) => ({
        url: `/element/by-ids`,
        method: "POST",
        body: elementsByIdsParams,
      }),
    }),
  }),
});

export const {
  useGetElementsByFiltersQuery,
  useGetSpecialItemsQuery,
  useGetElementsByFiltersPaginatedQuery,
  useLazyGetElementsByFiltersPaginatedQuery,
  useGetElementsByIdsQuery,
} = elementApi;
export { elementApi };
