import { Card, CardActionArea, CardMedia, Grid } from '@mui/material';
import { FC } from 'react';
import { IProduct } from '../../interfaces';
import { ProductCard } from './ProductCard';

interface Props {
  products: IProduct[];
}

export const ProductList: FC<Props> = ({ products }) => {
  return (
    <Grid container spacing={4}>
      {products.map((product: IProduct) => (
        <Grid item xs={6} sm={4} key={product.slug}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};
