import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  DesignFunctionEvaluation,
  DesignFunctionEvaluationResponse,
  DesignSubtype,
  DesignType,
  DesignWithSubDesigns,
  Template,
} from "../../commons/types";

const designApi = createApi({
  reducerPath: "designApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL,
  }),
  tagTypes: ["Design"],
  endpoints: (builder) => ({
    getDesignTypes: builder.query<DesignType[], void>({
      query: () => "/design/types",
      providesTags: ["Design"],
    }),
    getDesignSubtypesByTypeId: builder.query<DesignSubtype[], number>({
      query: (typeId) => `/design/subtypes/by-type/${typeId}`,
      providesTags: ["Design"],
    }),
    getDesignSubtypeWithFunctionsById: builder.query<DesignSubtype, number>({
      query: (subTypeId) => `/design/subtypes/${subTypeId}/with-functions`,
      providesTags: ["Design"],
    }),
    evaluateFunction: builder.mutation<
      DesignFunctionEvaluationResponse,
      DesignFunctionEvaluation
    >({
      query: (evaluationData) => ({
        url: "/design-functions/calculate",
        method: "POST",
        body: evaluationData,
      }),
    }),
    getTemplatesByDesignSubtypeId: builder.query<Template[], number>({
      query: (designSubtypeId) => `/design/templates/${designSubtypeId}`,
    }),
    saveDesignWithSubDesigns: builder.mutation<null, DesignWithSubDesigns>({
      query: (designData) => ({
        url: "/design",
        method: "POST",
        body: designData,
      }),
    }),
  }),
});

export const {
  useGetDesignTypesQuery,
  useGetDesignSubtypesByTypeIdQuery,
  useLazyGetDesignSubtypeWithFunctionsByIdQuery,
  useEvaluateFunctionMutation,
  useLazyGetTemplatesByDesignSubtypeIdQuery,
  useSaveDesignWithSubDesignsMutation,
} = designApi;
export { designApi };
