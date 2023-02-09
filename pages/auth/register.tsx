import React, { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context';
import { AuthLayout } from '../../components/layouts';
import { useForm } from 'react-hook-form';
import { ErrorOutline } from '@mui/icons-material';
import { validations } from '../../utils';
import { Box, Grid, Typography, TextField, Button, Link, Chip } from '@mui/material';
import { signIn, getSession } from 'next-auth/react';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { registerUser } = useContext(AuthContext);

  const destination = router.query.prevPage || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onRegisterUser = async ({ name, email, password }: FormData) => {
    setShowError(false);

    const { hasError, message } = await registerUser(name, email, password);

    if (hasError) {
      setShowError(true);
      setErrorMessage(message!);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
    await signIn('credentials', {
      email,
      password,
    });

    //router.replace((destination as string) || '/');
  };

  return (
    <AuthLayout title="Crear cuenta">
      <form onSubmit={handleSubmit(onRegisterUser)}>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Crear cuenta
              </Typography>
              {showError && <Chip label="No se puede crear el usuario" color="error" icon={<ErrorOutline />} className="fadeIn" />}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre completo"
                variant="filled"
                {...register('name', { required: 'Este campo es requerido', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth type="email" label="Email" variant="filled" {...register('email', { required: 'Este campo es requerido', validate: validations.isEmail })} error={!!errors.email} helperText={errors.email?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                variant="filled"
                {...register('password', { required: 'Este campo es requerido', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" color="secondary" className="circular-btn" size="large" fullWidth>
                Crear cuenta
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink href={destination ? `/auth/login?prevPage=${destination}` : '/auth/login'} passHref legacyBehavior>
                <Link underline="always">¿Ya tienes cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });

  const { prevPage = '/' } = query;
  if (session) {
    return {
      redirect: {
        destination: prevPage.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default RegisterPage;
