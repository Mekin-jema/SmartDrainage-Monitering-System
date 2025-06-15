export const taskColumns = React.useMemo(
  () => [
    {
      accessorKey: 'code',
      header: 'Manhole Code',
      cell: ({ row }) => <div className="font-medium">🧱 {row.getValue('code')}</div>,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.getValue('description')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const statusValue = row.getValue('status') || 'default';
        const status = getStatusInfo(statusValue);
        const Icon = status.icon;

        return (
          <Badge variant="outline" className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {status.label}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priorityValue = row.getValue('priority') || 'default';
        const priority = getPriorityInfo(priorityValue);
        return <Badge className={priority.color}>{priority.label}</Badge>;
      },
    },
    {
      accessorKey: 'progress',
      header: 'Progress',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Progress value={row.getValue('progress') || 0} className="h-2 w-[100px]" />
          <span className="text-sm text-muted-foreground">{row.getValue('progress') || 0}%</span>
        </div>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) =>
        row.getValue('dueDate')
          ? format(new Date(row.getValue('dueDate')), 'MMM dd, yyyy')
          : 'No date',
    },
  ],
  []
);
