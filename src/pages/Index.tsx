import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  InputAdornment,
  Fade,
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import heroImage from "@/assets/hero-iphones.jpg";
import api from '@/lib/api';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const iphones = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      model: "Titanium Natural", 
      price: 10499,
      originalPrice: 11299,
      color: "blue" as const,
      storage: "256GB",
      rating: 4.9,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      model: "Titanium Blue",
      price: 9499,
      color: "purple" as const,
      storage: "128GB",
      rating: 4.8,
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "iPhone 15",
      model: "Pink",
      price: 7299,
      color: "pink" as const,
      storage: "128GB",
      rating: 4.7,
      image: "/placeholder.svg",
    },
    {
      id: 4,
      name: "iPhone 15 Plus",
      model: "Green",
      price: 8299,
      color: "green" as const,
      storage: "256GB",
      rating: 4.8,
      image: "/placeholder.svg",
    },
  ];
  const [iphonesData, setIphonesData] = useState([]);

  async function getAllIphones() {
    try {
      const iphonesResponse = await api.get('/iphones');
      console.log(iphonesResponse.data);
      setIphonesData(iphonesResponse.data);
    } catch (error) {
      console.error('Erro ao buscar iPhones:', error);
      setIphonesData(iphones);
    }
  }

  useEffect(() => {
    getAllIphones();
  }, []);

  const handleAddToCart = (productName: string) => {
    console.log(`${productName} foi adicionado ao carrinho.`);
  };

  const filteredIphones = iphonesData.filter(iphone =>
    iphone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    iphone.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Navigation />
      
      {/* Hero Section */}
      <Box
        sx={{
          height: 500,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <Fade in timeout={1000}>
            <Box sx={{ maxWidth: 600, color: 'white' }}>
              <Chip
                label="Novos iPhones Disponíveis"
                sx={{
                  mb: 3,
                  backgroundColor: 'rgba(0, 122, 255, 0.8)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  background: 'linear-gradient(45deg, #FFFFFF, #5AC8FA)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                A Mais Completa
                <br />
                Loja de iPhones
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 400,
                  lineHeight: 1.4,
                }}
              >
                Descubra os mais recentes modelos com a melhor qualidade
                e garantia oficial Apple.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  backgroundColor: 'white',
                  color: '#007AFF',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Explorar Catálogo
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Filtros e Busca */}
        <Box sx={{ mb: 6, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Buscar por modelo, cor ou capacidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{
              py: 2,
              px: 3,
              borderRadius: 3,
              fontWeight: 600,
              minWidth: 140,
            }}
          >
            Filtros
          </Button>
        </Box>

        {/* Grid de Produtos */}
        <Box>
          <Typography
            variant="h3"
            sx={{
              mb: 4,
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            Nossos iPhones
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3 }}>
            {filteredIphones.map((iphone) => (
              <ProductCard
                key={iphone.id}
                name={iphone.name}
                model={iphone.model}
                price={iphone.price}
                originalPrice={iphone.originalPrice}
                color={iphone.color}
                storage={iphone.storage}
                rating={iphone.rating}
                image={iphone.image}
                onAddToCart={() => handleAddToCart(iphone.name)}
              />
            ))}
          </Box>

          {filteredIphones.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Nenhum produto encontrado para "{searchTerm}"
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Tente buscar por outro termo
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Index;