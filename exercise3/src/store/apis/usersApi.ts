import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { faker } from '@faker-js/faker'
import { User } from './types'

//Usamos query cuando queremos consummir o leer datos, GET
//Usamos mutation cuando queremos modificar datos, POST, PUT, DELETE

const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], null>({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
    }),
    addUser: builder.mutation<null, null>({
      query: () => ({
        url: '/users',
        method: 'POST',
        body: {
          name: faker.person.firstName(),
        },
      }),
    }),
    deleteUser: builder.mutation<null, User>({
      query: (user) => ({
        url: `/users/${user.id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const { useGetUsersQuery, useAddUserMutation, useDeleteUserMutation } =
  usersApi
export { usersApi }
