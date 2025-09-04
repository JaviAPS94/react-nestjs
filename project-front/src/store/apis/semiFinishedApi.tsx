import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SemiFinishedType } from "../../commons/types";

const semiFinishedApi = createApi({
  reducerPath: "semiFinishedApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL,
  }),
  endpoints: (builder) => ({
    getSemiFinished: builder.query<SemiFinishedType[], null>({
      query: () => ({
        url: "/semi-finished",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSemiFinishedQuery } = semiFinishedApi;
export { semiFinishedApi };
