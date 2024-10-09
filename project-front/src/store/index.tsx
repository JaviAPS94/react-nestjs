import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { countryApi } from "./apis/countryApi";
import { typeApi } from "./apis/typeApi";

export const store = configureStore({
  reducer: {
    [countryApi.reducerPath]: countryApi.reducer,
    [typeApi.reducerPath]: typeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(countryApi.middleware)
      .concat(typeApi.middleware),
});

setupListeners(store.dispatch);

export { useGetCountriesQuery } from "./apis/countryApi";
export { useGetTypesWithFieldsQuery } from "./apis/typeApi";
