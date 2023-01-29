import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const WomenPage: NextPage = () => {
  const { products, isLoading } = useProducts('/products?gender=women');

  return (
    <ShopLayout title={'Tesla Shop | Women'} pageDescription={'Productos de Tesla para mujer'}>
      <Typography variant="h1" component="h1">
        Tienda - Mujer
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Productos para ella
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default WomenPage;
