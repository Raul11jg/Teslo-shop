import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const MenPage: NextPage = () => {
  const { products, isLoading } = useProducts('/products?gender=men');

  return (
    <ShopLayout title={'Tesla Shop | Men'} pageDescription={'Productos de Tesla para hombre'}>
      <Typography variant="h1" component="h1">
        Tienda - Hombre
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Productos para él
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default MenPage;
