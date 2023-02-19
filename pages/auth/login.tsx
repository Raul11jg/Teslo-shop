import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { signIn, getSession, getProviders } from 'next-auth/react';
import { useRouter } from 'next/router';
import { AuthLayout } from '../../components/layouts';
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Divider, Grid, Link, TextField, Typography } from '@mui/material';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();

  //const { loginUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);
  const destination = router.query.prevPage || '';

  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov);
    });
  }, []);

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);

    /*     const isValidLogin = await loginUser(email, password);

    if (!isValidLogin) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    router.replace((destination as string) || '/'); */
    await signIn('credentials', { email, password });
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
              {showError && (
                <Typography variant="h5" className="fadeIn">
                  No reconocemos ese usuario / contraseña
                </Typography>
              )}
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
              <NextLink href={destination ? `/auth/register?prevPage=${destination}` : '/auth/register'} passHref legacyBehavior>
                <Link underline="always">¿No tienes cuenta?</Link>
              </NextLink>
            </Grid>

            <Grid item xs={12} display="flex" flexDirection="column" justifyContent="end">
              <Divider sx={{ width: '100%', mb: 2 }} />
              {Object.values(providers).map((provider: any) => {
                if (provider.id === 'credentials') return <div key="credentials"></div>;
                return (
                  <Button key={provider.id} variant="outlined" color="primary" fullWidth sx={{ mb: 1 }} onClick={() => signIn(provider.id)}>
                    {provider.name}
                  </Button>
                );
              })}
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

export default LoginPage;
