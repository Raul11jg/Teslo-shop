import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';
import { CartContext } from '../../context';
import { countries } from '../../utils/countries';

const SummaryPage = () => {
  const { shippingAddress, numberOfItems } = useContext(CartContext);

  return (
    <ShopLayout title={'Resumen de compra'} pageDescription={'Resumen de la orden'}>
      <Typography variant="h1" component="h1">
        Resumen de la orden
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                {' '}
                Resumen ({numberOfItems} {numberOfItems === 1 ? 'producto' : 'productos'}){' '}
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Dirección de entrega</Typography>
                <NextLink href="/checkout/address" passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              {shippingAddress && (
                <>
                  <Typography>
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </Typography>
                  <Typography>
                    {shippingAddress.address}
                    {shippingAddress.address2 ? ', ' + shippingAddress.address2 : ''}
                  </Typography>
                  <Typography>
                    {shippingAddress.postalCode} {shippingAddress.city}
                  </Typography>

                  <Typography>{countries.find((c) => c.code === shippingAddress.country)?.name}</Typography>
                  <Typography>{shippingAddress.phone}</Typography>
                </>
              )}

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="end">
                <NextLink href="/checkout/address" passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <Button color="secondary" className="circular-btn" fullWidth>
                  Confirmar orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
