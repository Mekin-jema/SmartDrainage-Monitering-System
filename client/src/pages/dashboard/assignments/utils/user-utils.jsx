
export const userColumns = React.useMemo(
  () => [
    {
      accessorKey: 'fullname',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const roleValue = row.getValue('role') || 'default';
        const role = getRoleInfo(roleValue);
        return <Badge className={role.color}>{role.label}</Badge>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const statusValue = row.getValue('status') || 'default';
        const status = getUserStatusInfo(statusValue);
        return <Badge className={status.color}>{status.label}</Badge>;
      },
    },
    {
      accessorKey: 'assignments',
      header: 'Tasks Assigned',
      cell: ({ row }) => {
        const assignments = row.getValue('assignments') || [];
        const userTasks = tasks.filter((task) =>
          assignments.some((assignment) => assignment._id === task._id)
        );

        if (!userTasks.length) {
          return <span>No tasks</span>;
        }

        return (
          <div className="flex flex-col gap-1">
            {userTasks.map((task) => (
              <Badge key={task._id} className="w-fit bg-gray-400">
                <div className="text-left">
                  <div>{task.code || 'Unnamed Task'}</div>
                  <div className="text-xs opacity-70">
                    {task.status ? getStatusInfo(task.status).label : 'No status'}
                  </div>
                </div>
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentUser(user);
                reset({
                  fullname: user.fullname,
                  email: user.email,
                  role: user.role,
                  status: user.status,
                });
                setIsEditDialogOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUserToDelete(user);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ],
  [tasks]
);

export const handleEditUser = async (data, setIsEditDialogOpen) => {
  try {
    updateUser(userId, data)

    setIsEditDialogOpen(false);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

export const handleDeleteUser = async (userToDelete) => {
  try {
    // setUsers(updatedUsers);
    deleteUser(userToDelete._id);
    setIsDeleteDialogOpen(false);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

export const handleCreateUser = async (data) => {
  try {
    const newUser = {
      _id: `user-${Date.now()}`,
      ...data,
      assignments: [],
    };
    setUsers([...users, newUser]);
    setIsCreateUserDialogOpen(false);
    reset();
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
