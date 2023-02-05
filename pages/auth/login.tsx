import React, { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { AuthLayout } from '../../components/layouts';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();

  const { loginUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);
  const destination = router.query.prevPage || '';

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);

    const isValidLogin = await loginUser(email, password);

    if (!isValidLogin) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    router.replace((destination as string) || '/');
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
              <NextLink href={destination ? `/auth/register?prevPage=${destination}` : '/auth/register'} passHref>
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
