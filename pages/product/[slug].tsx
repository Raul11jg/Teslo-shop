import { useState } from 'react';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { ICartProduct, IProduct } from '../../interfaces';
import { dbProducts } from '../../database';

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    images: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const handleCounterChange = (value: number) => {
    setTempCartProduct({ ...tempCartProduct, quantity: value });
  };

  const handleAddToCart = () => {
    console.log(tempCartProduct);
  };

  return (
    <ShopLayout title={product.title} pageDescription={''}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">{`$${product.price}`}</Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter currentValue={tempCartProduct.quantity} updatedQuantity={handleCounterChange} maxValue={product.inStock} />
              <SizeSelector sizes={product.sizes} selectedSize={tempCartProduct.size} tempCartProduct={tempCartProduct} setTempCartProduct={setTempCartProduct} />
            </Box>

            {product.inStock === 0 ? (
              <Chip label="No hay disponibles" color="error" variant="outlined" />
            ) : (
              <Button color="secondary" className="circular-btn" onClick={handleAddToCart}>
                {tempCartProduct.size ? 'Agregar al carrito' : 'Selecciona una talla'}
              </Button>
            )}

            {/* <Chip label="No hay disponibles" color="error" variant="outlined" /> */}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripción</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

/* export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params as { slug: string };

  const product = await dbProducts.getProductBySlug(slug);

  if (!product)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };

  return {
    props: {
      product,
    },
  };
}; */

//getStaticPaths

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await dbProducts.getAllProductSlugs();

  return {
    paths: slugs.map(({ slug }) => ({ params: { slug } })),
    fallback: 'blocking',
  };
};

//getStaticProps
// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = '' } = params as { slug: string };

  const product = await dbProducts.getProductBySlug(slug);

  if (!product)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };

  return {
    props: {
      product,
    },
    revalidate: 86400,
  };
};

export default ProductPage;
