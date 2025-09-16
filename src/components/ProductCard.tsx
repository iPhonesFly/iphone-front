import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const colorClasses = {
    blue: "bg-iphone-blue",
    purple: "bg-iphone-purple",
    pink: "bg-iphone-pink",
    green: "bg-iphone-green",
    yellow: "bg-iphone-yellow",
    red: "bg-iphone-red",
    black: "bg-iphone-black",
    white: "bg-iphone-white border",
  };

  return (
    <Card className="group overflow-hidden bg-gradient-card shadow-card hover:shadow-elegant transition-smooth border-border/50 hover:border-primary/20">
      <CardContent className="p-6">
        <div className="aspect-square bg-gradient-secondary rounded-lg mb-4 relative overflow-hidden">
          <img
            src={image}
            alt={`${name} ${model}`}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-bounce"
          />
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm"
          >
            {storage}
          </Badge>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{model}</p>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-4 h-4 rounded-full",
                colorClasses[color]
              )}
            />
            <span className="text-sm text-muted-foreground capitalize">
              {color === "black" ? "Preto" : color === "white" ? "Branco" : color}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-current"
                    : "text-muted-foreground"
                )}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">
              ({rating})
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(price)}
              </span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            <Button
              onClick={onAddToCart}
              className="w-full bg-gradient-primary hover:shadow-glow transition-smooth group"
            >
              <ShoppingCart className="h-4 w-4 mr-2 group-hover:scale-110 transition-bounce" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;