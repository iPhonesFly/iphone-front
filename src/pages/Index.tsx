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
import { Socket } from "socket.io-client";
import { getSocket } from '@/lib/socket';

// Interface para os dados do iPhone
interface IphoneData {
  id: number;
  name: string;
  model: string;
  price: number;
  originalPrice?: number;
  color: "blue" | "purple" | "pink" | "green" | "white" | "black" | "red" | "yellow";
  storage: string;
  rating: number;
  image: string;
}

// Dados mock como fallback
const mockIphones = [
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

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [iphonesData, setIphonesData] = useState<IphoneData[]>(mockIphones);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Conexão e busca dos iPhones via Socket.IO
  useEffect(() => {
    const socketConnection = getSocket();
    setSocket(socketConnection);

    // Event listeners
    socketConnection.on('connect', () => {
      console.info('Conectado ao servidor WebSocket');
      setIsConnected(true);
      
      // Buscar todos os iPhones quando conectar
      socketConnection.emit('get-all-iphones');
    });

    socketConnection.on('disconnect', () => {
      console.log('Desconectado do servidor WebSocket');
      setIsConnected(false);
    });

    // Receber lista de iPhones
    socketConnection.on('all-iphones', (data: IphoneData[]) => {
      console.log('Recebido all-iphones:', data);
      if (data && data.length > 0) {
        // Mapear dados da API para o formato esperado pelo componente
        const formattedData: IphoneData[] = data.map(iphone => ({
          ...iphone,
          color: (iphone.color || "blue") as IphoneData['color'],
          image: iphone.image || "/placeholder.svg",
          rating: iphone.rating || 4.5,
          storage: iphone.storage || "128GB",
          originalPrice: iphone.originalPrice || undefined
        }));

        console.info("formattedData: ", formattedData);
        setIphonesData(formattedData);
      } else {
        console.log('Usando dados mock como fallback');
        setIphonesData(mockIphones);
      }
    });

    // Receber notificação de novo iPhone criado
    socketConnection.on('iphone-created', (newIphone: IphoneData) => {
      console.log('Novo iPhone criado:', newIphone);
      // Recarregar todos os dados para garantir sincronização
      socketConnection.emit('get-all-iphones');
    });

    // Receber notificação de iPhone atualizado
    socketConnection.on('iphone-updated', (updatedIphone: IphoneData) => {
      console.log('iPhone atualizado:', updatedIphone);
      // Recarregar todos os dados para garantir sincronização
      socketConnection.emit('get-all-iphones');
    });

    // Receber notificação de iPhone deletado
    socketConnection.on('iphone-deleted', (deletedId: number) => {
      console.log('iPhone deletado:', deletedId);
      // Recarregar todos os dados para garantir sincronização
      socketConnection.emit('get-all-iphones');
    });

    // Tratamento de erros
    socketConnection.on('error', (error: string) => {
      console.error('Erro do Socket.IO:', error);
      setIphonesData(mockIphones);
    });

    // Verificar se já está conectado
    if (socketConnection.connected) {
      setIsConnected(true);
      socketConnection.emit('get-all-iphones');
    }

    // Cleanup na desmontagem (apenas remove listeners, não desconecta)
    return () => {
      socketConnection.off('connect');
      socketConnection.off('disconnect');
      socketConnection.off('all-iphones');
      socketConnection.off('iphone-created');
      socketConnection.off('iphone-updated');
      socketConnection.off('iphone-deleted');
      socketConnection.off('error');
    };
  }, []);

  const handleAddToCart = (productName: string) => {
    console.log(`${productName} foi adicionado ao carrinho.`);
  };

  // Função para recarregar dados
  const handleRefreshData = () => {
    if (socket && isConnected) {
      socket.emit('get-all-iphones');
    }
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
        {/* Status de Conexão */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={isConnected ? "Conectado ao servidor" : "Desconectado"}
            color={isConnected ? "success" : "error"}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Button
            variant="text"
            size="small"
            onClick={handleRefreshData}
            disabled={!isConnected}
            sx={{ fontWeight: 600 }}
          >
            Atualizar Dados
          </Button>
        </Box>

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