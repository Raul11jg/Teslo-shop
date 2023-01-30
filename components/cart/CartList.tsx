import React, { FC, useContext } from 'react';
import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import { ItemCounter } from '../ui';
import { CartContext } from '../../context';
import { ICartProduct } from '../../interfaces';

interface Props {
  editable?: boolean;
}

export const CartList: FC<Props> = ({ editable = false }) => {
  const { cart, updateCartQuantity } = useContext(CartContext);

  const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
    product.quantity = newQuantityValue;
    updateCartQuantity(product);
  };

  return (
    <>
      {cart.map((product) => (
        <Grid container spacing={2} sx={{ mb: 1 }} key={product.slug + product.size}>
          <Grid item xs={3}>
            <NextLink href={`products/${product.slug}`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia image={`/products/${product.image}`} component="img" sx={{ borderRadius: '5px' }} />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>

          <Grid item xs={7}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Talla: <strong>{product.size}</strong>
              </Typography>
              {editable ? (
                <ItemCounter currentValue={product.quantity} maxValue={10} updatedQuantity={(value) => onNewCartQuantityValue(product, value)} />
              ) : (
                <Typography variant="body1">
                  Cantidad: <strong>{product.quantity}</strong>
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={2} display="flex" alignItems="center" flexDirection="column">
            <Typography>{`$${product.price}`}</Typography>
            {editable && (
              <Button variant="text" color="secondary">
                Eliminar
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
