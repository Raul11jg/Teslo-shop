import { ConfirmationNumberOutlined } from '@mui/icons-material';
import React from 'react';
import { AdminLayout } from '../../components/layouts';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useSWR from 'swr';
import { IOrder, IUser } from '../../interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Orden ID', width: 250 },
  { field: 'email', headerName: 'Correo', width: 250 },
  { field: 'name', headerName: 'Nombre completo', width: 300 },
  { field: 'total', headerName: 'Monto total', width: 150 },
  {
    field: 'isPaid',
    headerName: 'Pagado',
    renderCell: ({ row }) => {
      return row.isPaid ? <Chip variant="outlined" label="Pagado" color="success" /> : <Chip variant="outlined" label="No pagado" color="error" />;
    },
    width: 200,
  },
  {
    field: 'inStock',
    headerName: 'En stock',
    align: 'center',
  },
  {
    field: 'check',
    headerName: 'Ver orden',
    renderCell: ({ row }) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver orden
        </a>
      );
    },
  },
  {
    field: 'createdAt',
    headerName: 'Fecha de creación',
    width: 300,
  },
];

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

  if (!data && !error) return <></>;

  if (!data || error) return <></>;

  const rows = data.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    inStock: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout title={'Órdenes'} subtitle={'Mantenimiendo de órdenes'} icon={<ConfirmationNumberOutlined />}>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
