import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Rating,
  IconButton,
} from '@mui/material';
import { ShoppingCart, FavoriteOutlined } from '@mui/icons-material';

interface ProductCardProps {
  name: string;
  model: string;
  price: number;
  originalPrice?: number;
  color: "blue" | "purple" | "pink" | "green" | "yellow" | "red" | "black" | "white";
  storage: string;
  rating: number;
  image: string;
  onAddToCart?: () => void;
}

const ProductCard = ({
  name,
  model,
  price,
  originalPrice,
  color,
  storage,
  rating,
  image,
  onAddToCart,
}: ProductCardProps) => {
  const formatPrice = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const colorMap = {
    blue: '#007AFF',
    purple: '#AF52DE',
    pink: '#FF2D92',
    green: '#30D158',
    yellow: '#FFD60A',
    red: '#FF453A',
    black: '#1D1D1F',
    white: '#F2F2F7',
  };

  const colorNames = {
    blue: 'Azul',
    purple: 'Roxo',
    pink: 'Rosa',
    green: 'Verde',
    yellow: 'Amarelo',
    red: 'Vermelho',
    black: 'Preto',
    white: 'Branco',
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '1',
          background: 'linear-gradient(135deg, #2C2C2E, #3A3A3C)',
          borderRadius: 2,
          m: 2,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src={image}
          alt={`${name} ${model}`}
          style={{
            width: '80%',
            height: '80%',
            objectFit: 'contain',
            transition: 'transform 0.3s ease',
          }}
        />
        <Chip
          label={storage}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(0, 122, 255, 0.9)',
            color: 'white',
            fontWeight: 600,
          }}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: 'rgba(28, 28, 30, 0.8)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(28, 28, 30, 0.9)',
              color: '#FF453A',
            },
          }}
          size="small"
        >
          <FavoriteOutlined fontSize="small" />
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {model}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: colorMap[color],
              border: color === 'white' ? '1px solid #38383A' : 'none',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {colorNames[color]}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={rating} precision={0.1} readOnly size="small" />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            ({rating})
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {formatPrice(price)}
          </Typography>
          {originalPrice && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              {formatPrice(originalPrice)}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<ShoppingCart />}
          onClick={onAddToCart}
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Adicionar ao Carrinho
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;