import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { AppBar, Toolbar, Typography, Link, Box, Button, IconButton, Badge, Input, InputAdornment } from '@mui/material';
import { CartContext, UiContext } from '../../context';

export const Navbar = () => {
  const { push, pathname } = useRouter();

  const { toggleSideMenu } = useContext(UiContext);

  const { numberOfItems } = useContext(CartContext);

  const [searchTerm, setSearchTerm] = useState('');

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`);
  };

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref legacyBehavior>
          <Link display="flex" alignItems="center">
            <Typography variant="h6">Tesla |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>

        <Box flex={1}></Box>

        <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }} className="fadeIn">
          <NextLink href="/category/men" passHref legacyBehavior>
            <Link>
              <Button color={pathname === '/category/men' ? 'info' : 'primary'}>Hombres</Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref legacyBehavior>
            <Link>
              <Button color={pathname === '/category/women' ? 'info' : 'primary'}>Mujeres</Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kid" passHref legacyBehavior>
            <Link>
              <Button color={pathname === '/category/kid' ? 'info' : 'primary'}>Niños</Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1}></Box>

        {/* Pantallas grandes */}
        {isSearchVisible ? (
          <Input
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            className="fadeIn"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') onSearchTerm();
            }}
            type="text"
            placeholder="Buscar..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setIsSearchVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton sx={{ display: { xs: 'none', sm: 'flex' } }} className="fadeIn" onClick={() => setIsSearchVisible(true)}>
            <SearchOutlined />
          </IconButton>
        )}

        {/* Pantallas pequeñas */}
        <IconButton sx={{ display: { xs: 'flex', sm: 'none' } }} onClick={toggleSideMenu}>
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref legacyBehavior>
          <Link>
            <IconButton>
              <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={toggleSideMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
