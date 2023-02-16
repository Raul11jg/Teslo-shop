import { CategoryOutlined } from '@mui/icons-material';
import React from 'react';
import useSWR from 'swr';
import { AdminLayout } from '../../components/layouts';
import { CardMedia, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IProduct } from '../../interfaces';

const columns: GridColDef[] = [
  {
    field: 'img',
    headerName: 'Imagen',
    renderCell: ({ row }) => {
      return (
        <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
          <CardMedia component="img" className="fadeIn" alt={row.title} image={`/products/${row.img}`} />
        </a>
      );
    },
  },
  { field: 'title', headerName: 'Title', width: 250 },
  { field: 'gender', headerName: 'Género' },
  { field: 'type', headerName: 'Tipo' },
  { field: 'inStock', headerName: 'Stock' },
  { field: 'price', headerName: 'Precio' },
  { field: 'sizes', headerName: 'Tallas', width: 250 },
];

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>('/api/admin/products');

  if (!data && !error) return <></>;

  if (!data || error) return <></>;

  const rows = data.map((product) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(', '),
    slug: product.slug,
  }));

  return (
    <AdminLayout title={'Productos'} subtitle={'Mantenimiendo de productos'} icon={<CategoryOutlined />}>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
