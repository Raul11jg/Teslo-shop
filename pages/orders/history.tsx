import { ShopLayout } from '../../components/layouts';
import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import NextLink from 'next/link';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagado',
    description: 'Muestra si la orden está pagada',
    width: 150,
    renderCell: (params) => {
      return params.row.paid ? <Chip color="success" label="Pagada" variant="outlined" /> : <Chip color="error" label="No pagada" variant="outlined" />;
    },
  },
  {
    field: 'link',
    headerName: 'Ver orden',
    description: 'Muestra el link para ver la orden',
    width: 150,
    sortable: false,
    renderCell: (params) => {
      return (
        <NextLink href={`/orders/${params.row.id}`} passHref legacyBehavior>
          <Link underline="always">Ver orden</Link>
        </NextLink>
      );
    },
  },
];

const rows = [
  { id: 1, paid: false, fullname: 'Raul Jimenez' },
  { id: 2, paid: false, fullname: 'Fernando Herrera' },
  { id: 3, paid: true, fullname: 'Miguel Angel' },
  { id: 4, paid: false, fullname: 'Pablo García' },
  { id: 5, paid: true, fullname: 'Elisa Sánchez' },
];

const HistoryPAge = () => {
  return (
    <ShopLayout title={'Historial de órdenes'} pageDescription={'Historial de órdenes del cliente'}>
      <Typography variant="h1" component="h1">
        Historial de órdenes
      </Typography>

      <Grid container>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default HistoryPAge;
