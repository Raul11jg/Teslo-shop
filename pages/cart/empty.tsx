import { Box, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import NextLink from 'next/link';

const EmptyPage = () => {
  return (
    <ShopLayout title={'Carrito vacío'} pageDescription={'No hay artículos en el carrito'}>
      <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 200px)">
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography>Su carrito está vacío</Typography>
          <NextLink href="/" passHref>
            <Link color="secondary" typography="h5">
              Volver a la tienda
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  );
};

export default EmptyPage;
