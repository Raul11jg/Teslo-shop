import { GetServerSideProps } from 'next';
import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout title={'Tesla Shop | Search'} pageDescription={'Encuentra los mejores productos de Tesla'}>
      <Typography variant="h1" component="h1">
        Buscar producto
      </Typography>

      {!foundProducts ? (
        <>
          <Typography variant="h2" sx={{ mb: 1 }}>
            No se encontraron productos con el término: {query}
          </Typography>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Otros productos que le pueden gustar
          </Typography>
          <ProductList products={products} />
        </>
      ) : (
        <>
          <Typography variant="h2" sx={{ mb: 1 }}>
            Resultado de la búsqueda: {query}
          </Typography>
          <ProductList products={products} />
        </>
      )}
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = '' } = params as { query: string };

  let products = await dbProducts.getProductsByTerm(query);
  const foundProducts = products.length > 0;

  //if no products found, show some random products TODO

  if (!foundProducts) {
    products = await dbProducts.getAllProducts();
  }

  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};

export default SearchPage;
