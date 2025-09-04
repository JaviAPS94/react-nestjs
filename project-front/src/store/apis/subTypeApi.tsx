import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SubType } from "../../commons/types";

const subTypeApi = createApi({
  reducerPath: "subTypeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL,
  }),
  endpoints: (builder) => ({
    getSubTypesWithFieldsByType: builder.query<SubType[], number>({
      query: (typeId: number) => ({
        url: `/sub-type/${typeId}/type`,
        method: "GET",
      }),
    }),
    getSubTypeById: builder.query<SubType, number>({
      query: (subTypeId: number) => ({
        url: `/sub-type/${subTypeId}`,
        method: "GET",
      }),
    }),
    getAllSubTypes: builder.query<SubType[], void>({
      query: () => ({
        url: `/sub-type/all`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetSubTypesWithFieldsByTypeQuery,
  useGetSubTypeByIdQuery,
  useGetAllSubTypesQuery,
} = subTypeApi;
export { subTypeApi };
