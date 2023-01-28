import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../components/layouts';
import { ProductList } from '../components/products';
import { useProducts } from '../hooks';

const HomePage: NextPage = () => {
  const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout title={'Tesla Shop | Home'} pageDescription={'Encuentra los mejores productos de Tesla'}>
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Todos los productos
      </Typography>

      {isLoading ? <Typography variant="h3">Cargando...</Typography> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default HomePage;
