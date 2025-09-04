import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { countryApi } from "./apis/countryApi";
import { typeApi } from "./apis/typeApi";
import { normApi } from "./apis/normApi";
import { elementApi } from "./apis/elementApi";
import { subTypeApi } from "./apis/subTypeApi";
import { accesoryApi } from "./apis/accesoryApi";
import { semiFinishedApi } from "./apis/semiFinishedApi";
import { countriesFlagsApi } from "./apis/countryFlagsApi";
import { designApi } from "./apis/designApi";

export const store = configureStore({
  reducer: {
    [countryApi.reducerPath]: countryApi.reducer,
    [typeApi.reducerPath]: typeApi.reducer,
    [normApi.reducerPath]: normApi.reducer,
    [elementApi.reducerPath]: elementApi.reducer,
    [subTypeApi.reducerPath]: subTypeApi.reducer,
    [accesoryApi.reducerPath]: accesoryApi.reducer,
    [semiFinishedApi.reducerPath]: semiFinishedApi.reducer,
    [countriesFlagsApi.reducerPath]: countriesFlagsApi.reducer,
    [designApi.reducerPath]: designApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(countryApi.middleware)
      .concat(typeApi.middleware)
      .concat(normApi.middleware)
      .concat(elementApi.middleware)
      .concat(subTypeApi.middleware)
      .concat(accesoryApi.middleware)
      .concat(semiFinishedApi.middleware)
      .concat(countriesFlagsApi.middleware)
      .concat(designApi.middleware),
});

setupListeners(store.dispatch);

export { useGetCountriesQuery } from "./apis/countryApi";
export { useGetTypesWithFieldsQuery } from "./apis/typeApi";
export {
  useSaveNormMutation,
  useGetSpecificationsQuery,
  useGetNormsPaginatedQuery,
  useGetNormByIdQuery,
} from "./apis/normApi";
export {
  useGetElementsByFiltersQuery,
  useGetElementsByFiltersPaginatedQuery,
  useLazyGetElementsByFiltersPaginatedQuery,
  useGetElementsByIdsQuery,
} from "./apis/elementApi";
export {
  useGetSubTypesWithFieldsByTypeQuery,
  useGetSubTypeByIdQuery,
  useGetAllSubTypesQuery,
} from "./apis/subTypeApi";
export { useGetAccesoriesByNameMutation } from "./apis/accesoryApi";
export { useGetSemiFinishedQuery } from "./apis/semiFinishedApi";
export { useGetCountryFlagByCodeQuery } from "./apis/countryFlagsApi";
export { subTypeApi } from "./apis/subTypeApi";
export {
  useGetDesignTypesQuery,
  useGetDesignSubtypesByTypeIdQuery,
  useLazyGetDesignSubtypeWithFunctionsByIdQuery,
  useEvaluateFunctionMutation,
  useLazyGetTemplatesByDesignSubtypeIdQuery,
  useSaveDesignWithSubDesignsMutation,
} from "./apis/designApi";
export type AppDispatch = typeof store.dispatch;
