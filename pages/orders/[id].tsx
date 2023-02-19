import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { teslaApi } from '../../axiosApi';

interface Props {
  order: IOrder;
}

export type OrderResponseBody = {
  id: string;
  status: 'COMPLETED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'PAYER_ACTION_REQUIRED';
};

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter();
  const { shippingAddress } = order;
  const [isPaying, setIsPaying] = useState(false);

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== 'COMPLETED') {
      return alert('Error al procesar el pago');
    }
    setIsPaying(true);

    try {
      const { data } = await teslaApi.post('/orders/pay', {
        transactionId: details.id,
        orderId: order._id,
      });
      router.reload();
    } catch (error) {
      setIsPaying(false);
      alert('Error al procesar el pago');
      console.log(error);
    }
  };

  return (
    <ShopLayout title={`Resumen de la orden ${order._id}`} pageDescription={'Resumen de la orden'}>
      <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
        Order: {order._id}
      </Typography>
      {order.isPaid ? (
        <Chip sx={{ my: 2 }} label="Orden pagada" variant="outlined" color="success" icon={<CreditScoreOutlined />} />
      ) : (
        <Chip sx={{ my: 2 }} label="Pendiente de pago" variant="outlined" color="error" icon={<CreditCardOffOutlined />} />
      )}

      <Grid container spacing={3} className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                {' '}
                Resumen ({order.numberOfItems}
                {order.numberOfItems > 1 ? ' productos' : ' producto'}){' '}
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Dirección de entrega</Typography>
              </Box>

              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Typography>
              <Typography>
                {shippingAddress.address} {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}{' '}
              </Typography>
              <Typography>
                {shippingAddress.city}, {shippingAddress.postalCode}
              </Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary order={order} />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                {/* TODO */}
                <Box display="flex" justifyContent="center" className="fadeIn">
                  <CircularProgress sx={{ display: isPaying ? 'flex' : 'none' }} />
                </Box>

                <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection="column">
                  {order.isPaid ? (
                    <Chip sx={{ my: 2 }} label="Orden pagada" variant="outlined" color="success" icon={<CreditScoreOutlined />} />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: `${order.total}`,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          onOrderCompleted(details);
                          //console.log({ details });
                          //const name = details.payer.name!.given_name;
                          //alert(`Transaction completed by ${name}`);
                        });
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query;
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login/prevPage=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
