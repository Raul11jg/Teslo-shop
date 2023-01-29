import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { AppBar, Toolbar, Typography, Link, Box, Button, IconButton, Badge } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

export const Navbar = () => {
  const { pathname } = useRouter();

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link display="flex" alignItems="center">
            <Typography variant="h6">Tesla |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>

        <Box flex={1}></Box>

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <NextLink href="/category/men" passHref>
            <Link>
              <Button color={pathname === '/category/men' ? 'info' : 'primary'}>Hombres</Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref>
            <Link>
              <Button color={pathname === '/category/women' ? 'info' : 'primary'}>Mujeres</Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kid" passHref>
            <Link>
              <Button color={pathname === '/category/kid' ? 'info' : 'primary'}>Niños</Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1}></Box>

        <IconButton>
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={2} color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
