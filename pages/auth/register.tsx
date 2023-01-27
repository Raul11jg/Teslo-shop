import React from 'react';
import { AuthLayout } from '../../components/layouts';
import { Box, Grid, Typography, TextField, Button, Link } from '@mui/material';
import NextLink from 'next/link';

const RegisterPage = () => {
  return (
    <AuthLayout title="Crear cuenta">
      <Box sx={{ width: 350, padding: '10px 20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h1" component="h1">
              Crear cuenta
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Nombre completo" variant="filled" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Email" variant="filled" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Contraseña" type="password" variant="filled" />
          </Grid>

          <Grid item xs={12}>
            <Button color="secondary" className="circular-btn" size="large" fullWidth>
              Login
            </Button>
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="end">
            <NextLink href="/auth/login" passHref>
              <Link underline="always">¿Ya tienes cuenta?</Link>
            </NextLink>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;
