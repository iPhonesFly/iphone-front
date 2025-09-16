import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  ShoppingBag,
  People,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
  // Dados mock para os gráficos
  const salesData = [
    { month: "Jan", vendas: 45, faturamento: 185000 },
    { month: "Fev", vendas: 52, faturamento: 208000 },
    { month: "Mar", vendas: 48, faturamento: 192000 },
    { month: "Abr", vendas: 61, faturamento: 244000 },
    { month: "Mai", vendas: 55, faturamento: 220000 },
    { month: "Jun", vendas: 67, faturamento: 268000 },
  ];

  const modelData = [
    { model: "iPhone 15 Pro", vendas: 45, cor: "#007AFF" },
    { model: "iPhone 15", vendas: 38, cor: "#AF52DE" },
    { model: "iPhone 14", vendas: 32, cor: "#30D158" },
    { model: "iPhone 14 Pro", vendas: 28, cor: "#FFD60A" },
    { model: "iPhone SE", vendas: 15, cor: "#FF453A" },
  ];

  const revenueData = [
    { day: "Seg", valor: 25000 },
    { day: "Ter", valor: 32000 },
    { day: "Qua", valor: 28000 },
    { day: "Qui", valor: 45000 },
    { day: "Sex", valor: 52000 },
    { day: "Sáb", valor: 38000 },
    { day: "Dom", valor: 22000 },
  ];

  const kpis = [
    {
      title: "Faturamento Total",
      value: "R$ 1.317.000",
      change: "+12.5%",
      icon: AttachMoney,
      color: "#30D158",
    },
    {
      title: "Vendas Totais", 
      value: "328",
      change: "+8.3%",
      icon: ShoppingBag,
      color: "#007AFF",
    },
    {
      title: "Clientes Ativos",
      value: "1.234",
      change: "+15.2%",
      icon: People,
      color: "#AF52DE",
    },
    {
      title: "Ticket Médio",
      value: "R$ 4.014",
      change: "+3.8%",
      icon: TrendingUp,
      color: "#FF9F0A",
    },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Navigation />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Dashboard de Vendas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Acompanhe o desempenho das suas vendas de iPhone em tempo real
          </Typography>
        </Box>

        {/* KPIs */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
          {kpis.map((kpi) => (
            <Card key={kpi.title}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {kpi.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {kpi.value}
                    </Typography>
                    <Chip
                      label={kpi.change}
                      size="small"
                      sx={{
                        backgroundColor: kpi.color,
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      backgroundColor: `${kpi.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <kpi.icon sx={{ fontSize: 28, color: kpi.color }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 3 }}>
          {/* Gráfico de Vendas Mensais */}
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Vendas Mensais
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#38383A" />
                  <XAxis dataKey="month" stroke="#8E8E93" />
                  <YAxis stroke="#8E8E93" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1C1C1E",
                      border: "1px solid #38383A",
                      borderRadius: "12px",
                      color: "#FFFFFF",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="vendas"
                    stroke="#007AFF"
                    strokeWidth={3}
                    dot={{ fill: "#007AFF", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: "#007AFF", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Faturamento */}
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Faturamento Semanal
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#38383A" />
                  <XAxis dataKey="day" stroke="#8E8E93" />
                  <YAxis stroke="#8E8E93" />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Faturamento"]}
                    contentStyle={{
                      backgroundColor: "#1C1C1E",
                      border: "1px solid #38383A",
                      borderRadius: "12px",
                      color: "#FFFFFF",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="valor"
                    stroke="#007AFF"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Modelos Mais Vendidos */}
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Modelos Mais Vendidos
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#38383A" />
                  <XAxis dataKey="model" stroke="#8E8E93" />
                  <YAxis stroke="#8E8E93" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1C1C1E",
                      border: "1px solid #38383A",
                      borderRadius: "12px",
                      color: "#FFFFFF",
                    }}
                  />
                  <Bar dataKey="vendas" fill="#007AFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico Pizza - Distribuição por Modelo */}
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Distribuição de Vendas
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={modelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="vendas"
                  >
                    {modelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1C1C1E",
                      border: "1px solid #38383A",
                      borderRadius: "12px",
                      color: "#FFFFFF",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;