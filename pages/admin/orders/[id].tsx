import { GetServerSideProps, NextPage } from 'next';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';

import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { IOrder } from '../../../interfaces';
import { ShopLayout } from '../../../components/layouts';
import { CartList, OrderSummary } from '../../../components/cart';
import { dbOrders } from '../../../database';

interface Props {
  order: IOrder;
}

export type OrderResponseBody = {
  id: string;
  status: 'COMPLETED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'PAYER_ACTION_REQUIRED';
};

const OrderAdminPage: NextPage<Props> = ({ order }) => {
  const { shippingAddress } = order;

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
                <Box sx={{ display: 'flex', flex: 1 }} flexDirection="column">
                  {order.isPaid ? (
                    <Chip sx={{ my: 2 }} label="Orden pagada" variant="outlined" color="success" icon={<CreditScoreOutlined />} />
                  ) : (
                    <Chip sx={{ my: 2 }} label="Pendiente de pago" variant="outlined" color="error" icon={<CreditCardOffOutlined />} />
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

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
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

export default OrderAdminPage;
