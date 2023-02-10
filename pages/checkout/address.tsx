import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { ShopLayout } from '../../components/layouts';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { countries } from '../../utils';
import Cookie from 'js-cookie';
import { useContext } from 'react';
import { CartContext } from '../../context';
import { useEffect } from 'react';

type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
};

const getAddressFromCookies = (): FormData => {
  return {
    firstName: Cookie.get('firstName') || '',
    lastName: Cookie.get('lastName') || '',
    address: Cookie.get('address') || '',
    address2: Cookie.get('address2') || '',
    postalCode: Cookie.get('postalCode') || '',
    city: Cookie.get('city') || '',
    country: Cookie.get('country') || '',
    phone: Cookie.get('phone') || '',
  };
};

const AddressPage = () => {
  const router = useRouter();
  const { updateShippingAddress } = useContext(CartContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      address2: '',
      postalCode: '',
      city: '',
      country: countries[0].code,
      phone: '',
    },
  });

  useEffect(() => {
    reset(getAddressFromCookies());
  }, [reset]);

  const handleCheckout = (dataForm: FormData) => {
    updateShippingAddress(dataForm);
    router.push('/checkout/summary');
  };

  return (
    <ShopLayout title={'Dirección'} pageDescription={'Confirmar dirección del destino'}>
      <Typography variant="h1" component="h1">
        Dirección
      </Typography>

      <form onSubmit={handleSubmit(handleCheckout)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Nombre" variant="filled" fullWidth {...register('firstName', { required: 'Este campo es requerido' })} error={!!errors.firstName} helperText={errors.firstName?.message} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Apellido" variant="filled" fullWidth {...register('lastName', { required: 'Este campo es requerido' })} error={!!errors.lastName} helperText={errors.lastName?.message} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Dirección" variant="filled" fullWidth {...register('address', { required: 'Este campo es requerido' })} error={!!errors.address} helperText={errors.address?.message} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Dirección 2 (opcional)" variant="filled" fullWidth {...register('address2')} error={!!errors.address2} helperText={errors.address2?.message} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Código postal" variant="filled" fullWidth {...register('postalCode', { required: 'Este campo es requerido' })} error={!!errors.postalCode} helperText={errors.postalCode?.message} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Ciudad" variant="filled" fullWidth {...register('city', { required: 'Este campo es requerido' })} error={!!errors.city} helperText={errors.city?.message} />
          </Grid>

          <Grid item xs={12} sm={6}>
            {/* <FormControl fullWidth> */}
            <TextField
              // select
              variant="filled"
              label="País"
              fullWidth
              // defaultValue={ Cookies.get('country') || countries[0].code }
              {...register('country', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.country}
              helperText={errors.country?.message}
            />
            {/* {
                                countries.map( country => (
                                    <MenuItem 
                                        key={ country.code }
                                        value={ country.code }
                                    >{ country.name }</MenuItem>
                                ))
                            }
                        </TextField> */}
            {/* </FormControl> */}
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Teléfono" variant="filled" fullWidth {...register('phone', { required: 'Este campo es requerido' })} error={!!errors.phone} helperText={errors.phone?.message} />
          </Grid>
        </Grid>

        <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
          <Button type="submit" color="secondary" className="circular-btn" size="large">
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

/* export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token = '' } = req.cookies;
  let isValidToken = false;

  try {
    await jwt.isValidToken(token);
    isValidToken = true;
  } catch (error) {
    isValidToken = false;
  }

  if (!isValidToken) {
    return {
      redirect: {
        destination: '/auth/login?prevPage=/checkout/address',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}; */

export default AddressPage;
