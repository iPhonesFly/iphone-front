import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-iphones.jpg";

const Index = () => {
  const { toast } = useToast();

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
    {
      id: 5,
      name: "iPhone 14 Pro",
      model: "Space Black",
      price: 8499,
      originalPrice: 9499,
      color: "black" as const,
      storage: "512GB",
      rating: 4.6,
      image: "/placeholder.svg",
    },
    {
      id: 6,
      name: "iPhone 14",
      model: "Starlight",
      price: 6299,
      color: "white" as const,
      storage: "128GB",
      rating: 4.5,
      image: "/placeholder.svg",
    },
    {
      id: 7,
      name: "iPhone SE",
      model: "Product RED",
      price: 3299,
      color: "red" as const,
      storage: "64GB",
      rating: 4.3,
      image: "/placeholder.svg",
    },
    {
      id: 8,
      name: "iPhone 13",
      model: "Midnight",
      price: 5299,
      color: "black" as const,
      storage: "128GB",
      rating: 4.4,
      image: "/placeholder.svg",
    },
  ];

  const handleAddToCart = (productName: string) => {
    toast({
      title: "Produto Adicionado!",
      description: `${productName} foi adicionado ao carrinho.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-primary/20"></div>
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30">
                Novos iPhones Disponíveis
              </Badge>
              <h1 className="text-5xl font-bold mb-4 leading-tight">
                A Mais Completa
                <br />
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Loja de iPhones
                </span>
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Descubra os mais recentes modelos com a melhor qualidade e garantia oficial Apple.
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow">
                Explorar Catálogo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por modelo, cor ou capacidade..."
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </Button>
        </div>

        {/* Grid de Produtos */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Nossos iPhones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {iphones.map((iphone) => (
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
