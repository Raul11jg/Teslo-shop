import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { teslaApi } from '../../api';
import { IUser } from '../../interfaces';
import { AdminLayout } from '../../components/layouts';
import { PeopleOutline } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Grid, MenuItem, Select } from '@mui/material';

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users');

  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) return <></>;

  if (!data || error) return <></>;

  const onRoleUpdated = async (userId: string, newRole: string) => {
    const previusUsers = users.map((user) => ({ ...user }));
    const updatedUsers = users.map((user) => ({
      ...user,
      role: user._id === userId ? newRole : user.role,
    }));

    setUsers(updatedUsers);

    try {
      await teslaApi.put('/admin/users', { userId, role: newRole });
    } catch (error) {
      setUsers(previusUsers);
      alert('Error al actualizar el rol del usuario');
    }
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: ({ row }) => {
        return (
          <Select
            value={row.role}
            label="Rol"
            onChange={(e) => {
              onRoleUpdated(row.id as string, e.target.value as string);
            }}
            sx={{ width: '300px' }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="super-user">Super User</MenuItem>
            <MenuItem value="SEO">SEO</MenuItem>
          </Select>
        );
      },
    },
  ];

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  return (
    <AdminLayout title={'Usuarios'} subtitle={'Mantenimiento de usuarios'} icon={<PeopleOutline />}>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
