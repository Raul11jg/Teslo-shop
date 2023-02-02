import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';
import NextLink from 'next/link';
import { CreditScoreOutlined } from '@mui/icons-material';

const OrderPage = () => {
  return (
    <ShopLayout title={'Resumen de la orden 123123'} pageDescription={'Resumen de la orden'}>
      <Typography variant="h1" component="h1">
        Order: 123123
      </Typography>
      {/* 
      <Chip sx={{ my: 2 }} label="Pendiente de pago" variant="outlined" color="error" icon={<CreditCardOffOutlined />} /> */}
      <Chip sx={{ my: 2 }} label="Orden pagada" variant="outlined" color="success" icon={<CreditScoreOutlined />} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2"> Resumen (3 productos) </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Dirección de entrega</Typography>
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>Raúl Jiménez</Typography>
              <Typography>02032 Ciudad Juarez</Typography>
              <Typography>México</Typography>
              <Typography>+34 696343325</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="end">
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                {/* TODO */}
                <h1>Pagar</h1>
                <Chip sx={{ my: 2 }} label="Orden pagada" variant="outlined" color="success" icon={<CreditScoreOutlined />} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default OrderPage;
