import React, { useState } from 'react';
import { AuthLayout } from '../../components/layouts';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { teslaApi } from '../../api';
import { ErrorOutline } from '@mui/icons-material';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);

    try {
      const { data } = await teslaApi.post('/user/login', { email, password });
      const { token, user } = data;
      console.log(token, user);
    } catch (error) {
      console.log(error);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }

    //TODO: navigate to previous page or home
  };

  return (
    <AuthLayout title="Iniciar sesión">
      <form onSubmit={handleSubmit(onLoginUser)}>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar sesión
              </Typography>
              {showError && <Chip label="No reconocemos ese usuario / contraseña" color="error" icon={<ErrorOutline />} className="fadeIn" />}
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth type="email" label="Email" variant="filled" {...register('email', { required: 'Este campo es requerido', validate: validations.isEmail })} error={!!errors.email} helperText={errors.email?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Contraseña"
                variant="filled"
                {...register('password', { required: 'Este campo es requerido', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth type="submit" color="secondary" className="circular-btn" size="large">
                Login
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink href="/auth/register" passHref>
                <Link underline="always">¿No tienes cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
