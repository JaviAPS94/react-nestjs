import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { usersApi } from "./apis/usersApi";

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware),
})

setupListeners(store.dispatch)

export { useAddUserMutation, useDeleteUserMutation, useGetUsersQuery } from './apis/usersApi'
//
// export { useAddUserMutation, useDeleteUserMutation, useGetUsersQuery } from './apis/productsApi'
