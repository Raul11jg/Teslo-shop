import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';
import { CartContext } from '../../context';
import Cookies from 'js-cookie';

const SummaryPage = () => {
  const router = useRouter();
  const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);

  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!Cookies.get('firstName')) {
      router.push('/checkout/address');
    }
  }, [router]);

  const onCreateOrder = async () => {
    setIsPosting(true);
    const { hasError, message } = await createOrder();
    if (hasError) {
      setIsPosting(false);
      setErrorMessage(message);
      return;
    }

    router.replace(`/orders/${message}`);
  };

  if (!shippingAddress) {
    return <></>;
  }

  return (
    <ShopLayout title={'Resumen de compra'} pageDescription={'Resumen de la orden'}>
      <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
        Resumen de la orden
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <CartList />
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

                  {/* <Typography>{ countries.find( c => c.code === country )?.name }</Typography> */}
                  <Typography>{shippingAddress.country}</Typography>
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

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Button color="secondary" className="circular-btn" fullWidth onClick={onCreateOrder} disabled={isPosting}>
                  Confirmar orden
                </Button>
                <Chip label={errorMessage} color="error" sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
