import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { countryApi } from "./apis/countryApi";
import { typeApi } from "./apis/typeApi";
import { normApi } from "./apis/normApi";
import { elementApi } from "./apis/elementApi";
import { subTypeApi } from "./apis/subTypeApi";
import { accesoryApi } from "./apis/accesoryApi";
import { semiFinishedApi } from "./apis/semiFinishedApi";

export const store = configureStore({
  reducer: {
    [countryApi.reducerPath]: countryApi.reducer,
    [typeApi.reducerPath]: typeApi.reducer,
    [normApi.reducerPath]: normApi.reducer,
    [elementApi.reducerPath]: elementApi.reducer,
    [subTypeApi.reducerPath]: subTypeApi.reducer,
    [accesoryApi.reducerPath]: accesoryApi.reducer,
    [semiFinishedApi.reducerPath]: semiFinishedApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(countryApi.middleware)
      .concat(typeApi.middleware)
      .concat(normApi.middleware)
      .concat(elementApi.middleware)
      .concat(subTypeApi.middleware)
      .concat(accesoryApi.middleware)
      .concat(semiFinishedApi.middleware),
});

setupListeners(store.dispatch);

export { useGetCountriesQuery } from "./apis/countryApi";
export { useGetTypesWithFieldsQuery } from "./apis/typeApi";
export { useSaveNormMutation, useGetSpecificationsQuery } from "./apis/normApi";
export { useGetElementsByFiltersQuery } from "./apis/elementApi";
export { useGetSubTypesWithFieldsByTypeQuery } from "./apis/subTypeApi";
export { useGetAccesoriesByNameMutation } from "./apis/accesoryApi";
export { useGetSemiFinishedQuery } from "./apis/semiFinishedApi";
