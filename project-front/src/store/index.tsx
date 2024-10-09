import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { countryApi } from "./apis/countryApi";
import { typeApi } from "./apis/typeApi";
import { normApi } from "./apis/normApi";
import { elementApi } from "./apis/elementApi";

export const store = configureStore({
  reducer: {
    [countryApi.reducerPath]: countryApi.reducer,
    [typeApi.reducerPath]: typeApi.reducer,
    [normApi.reducerPath]: normApi.reducer,
    [elementApi.reducerPath]: elementApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(countryApi.middleware)
      .concat(typeApi.middleware)
      .concat(normApi.middleware)
      .concat(elementApi.middleware),
});

setupListeners(store.dispatch);

export { useGetCountriesQuery } from "./apis/countryApi";
export { useGetTypesWithFieldsQuery } from "./apis/typeApi";
export { useSaveNormMutation } from "./apis/normApi";
export { useGetElementsByFiltersQuery } from "./apis/elementApi";
