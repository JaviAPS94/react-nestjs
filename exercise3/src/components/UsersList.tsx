import { useAddUserMutation, useGetUsersQuery } from "../store"
import Skeleton from "./Skeleton"
import React from "react"
import UserListItem from "./UsersListItem"
import Button from "./Button"

function UsersList() {
  const { data: usersData, error: usersError, isLoading: isLoadingUsers } = useGetUsersQuery(null)
  const [addUser, results] = useAddUserMutation()

  let content

  if (isLoadingUsers) {
    content = <Skeleton times={6} className="h-10 w-full" />
  } else if (usersError) {
    content = <div>Error loading users</div>
  } else {
    content = usersData?.map((user) => (
      <UserListItem key={user.id} user={user} />
    ))
  }

  const handleUserAdd = () => {
    // Add user here
    addUser(null)
  }

  return (
    <div>
      <div className="flex flex-row justify-between items-center m-3">
        <h1>Users List</h1>
        <Button loading={results.isLoading} onClick={handleUserAdd}>Add User</Button>
        {results.isError && <div>Error adding user</div>}
      </div>
      {content}
    </div>
  )
}

export default UsersList
