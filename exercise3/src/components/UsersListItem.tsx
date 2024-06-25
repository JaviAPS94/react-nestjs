import { User } from '../store/apis/types'
import Button from './Button'
import { GoTrash } from 'react-icons/go'
import React from 'react'
import { useDeleteUserMutation } from '../store'

interface UserListItemProps {
  user: User
}

function UserListItem({ user }: UserListItemProps) {
  const [deleteUser, results] = useDeleteUserMutation()

  const handleClick = () => {
    deleteUser(user)
  }

  const test = 'asdad'

  return (
    <div className="flex flex-row">
      <Button loading={results.isLoading} onClick={handleClick}>
        <GoTrash />
      </Button>
      {results.isError && <div>Error deleting user</div>}
      {user.name}
    </div>
  )
}

export default UserListItem
