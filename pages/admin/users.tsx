import { PeopleOutline } from '@mui/icons-material';
import React from 'react';
import { AdminLayout } from '../../components/layouts';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, MenuItem, Select } from '@mui/material';
import useSWR from 'swr';
import { IUser } from '../../interfaces';
import { teslaApi } from '../../api';

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users');

  if (!data && !error) return <></>;

  if (!data || error) return <></>;

  const onRoleUpdated = async (userId: string, newRole: string) => {
    try {
      await teslaApi.put('/admin/users', { userId, role: newRole });
    } catch (error) {
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

  const rows = data!.map((user) => ({
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
