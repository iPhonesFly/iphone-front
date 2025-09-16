import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import {
  BarChart,
  ShoppingBag,
  Smartphone,
} from '@mui/icons-material';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Catálogo", icon: Smartphone },
    { path: "/dashboard", label: "Dashboard", icon: BarChart },
  ];

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box component={Link} to="/" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <ShoppingBag sx={{ mr: 1, fontSize: 28 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #007AFF, #5AC8FA)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              iStore Pro
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                component={Link}
                to={path}
                variant={location.pathname === path ? "contained" : "outlined"}
                startIcon={<Icon />}
                sx={{
                  minWidth: 'auto',
                  px: 3,
                  py: 1,
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;