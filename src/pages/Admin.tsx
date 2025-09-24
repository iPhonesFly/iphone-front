import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Fab,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Close,
} from '@mui/icons-material';
import Navigation from "@/components/Navigation";
import api from '@/lib/api';
import { Socket } from "socket.io-client";
import { getSocket } from '@/lib/socket';

interface iPhone {
  id?: number;
  name: string;
  model: string;
  price: number;
  storage: string;
  color: string;
  image: string;
}

const Admin = () => {
  const [iphones, setIphones] = useState<iPhone[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIphone, setEditingIphone] = useState<iPhone | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<iPhone>({
    name: '',
    model: '',
    price: 0,
    storage: '',
    color: '',
    image: '',
  });

  // Buscar todos os iPhones via Socket.IO
  const refreshIphones = () => {
    const socket = getSocket();
    if (socket.connected) {
      setIsLoading(true);
      socket.emit('get-all-iphones');
    } else {
      showSnackbar('Socket desconectado. Tentando reconectar...', 'error');
    }
  };

  // Criar novo iPhone
  const createIphone = async (iphone: iPhone) => {
    try {
      console.info("Creating iPhone: ", iphone);
      const socket = getSocket();
      socket.emit('create-iphone', iphone);
      showSnackbar('iPhone criado com sucesso!', 'success');
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao criar iPhone:', error);
      showSnackbar('Erro ao criar iPhone', 'error');
    }
  };

  // Atualizar iPhone
  const updateIphone = async (id: number, iphone: iPhone) => {
    try {
      console.info("Updating iPhone: ", id, iphone);
      const socket = getSocket();
      socket.emit('update-iphone', { id, ...iphone });
      showSnackbar('iPhone atualizado com sucesso!', 'success');
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao atualizar iPhone:', error);
      showSnackbar('Erro ao atualizar iPhone', 'error');
    }
  };

  // Deletar iPhone
  const deleteIphone = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este iPhone?')) {
      try {
        console.info("Deleting iPhone: ", id);
        const socket = getSocket();
        socket.emit('delete-iphone', id);
        showSnackbar('iPhone deletado com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao deletar iPhone:', error);
        showSnackbar('Erro ao deletar iPhone', 'error');
      }
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (iphone?: iPhone) => {
    if (iphone) {
      setEditingIphone(iphone);
      setFormData(iphone);
    } else {
      setEditingIphone(null);
      setFormData({
        name: '',
        model: '',
        price: 0,
        storage: '',
        color: '',
        image: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIphone(null);
    setFormData({
      name: '',
      model: '',
      price: 0,
      storage: '',
      color: '',
      image: '',
    });
  };

  const handleSubmit = () => {
    if (editingIphone && editingIphone.id) {
      updateIphone(editingIphone.id, formData);
    } else {
      createIphone(formData);
    }
  };

  const handleInputChange = (field: keyof iPhone) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'price' ? parseFloat(event.target.value) || 0 : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    // Usar socket compartilhado
    const socket = getSocket();

    // Monitorar conexão
    socket.on('connect', () => {
      console.log('Admin conectado ao socket');
      setIsConnected(true);
      // Buscar iPhones quando conectar
      socket.emit('get-all-iphones');
    });

    socket.on('disconnect', () => {
      console.log('Admin desconectado do socket');
      setIsConnected(false);
    });

    // Verificar se já está conectado
    if (socket.connected) {
      setIsConnected(true);
      // Buscar iPhones se já conectado
      socket.emit('get-all-iphones');
    }

    // Receber lista de iPhones atualizada
    socket.on('all-iphones', (data: iPhone[]) => {
      console.log('Recebido all-iphones no Admin:', data);
      setIsLoading(false);
      if (data && Array.isArray(data)) {
        setIphones(data);
      } else {
        setIphones([]);
      }
    });

    // Escutar quando um novo iPhone for criado
    socket.on('iphone-created', (newIphone) => {
      console.log('Novo iPhone criado via socket:', newIphone);
      // Recarregar dados para garantir sincronização
      socket.emit('get-all-iphones');
      showSnackbar('iPhone criado em tempo real!', 'success');
    });

    // Escutar quando um iPhone for atualizado
    socket.on('iphone-updated', (updatedIphone) => {
      console.log('iPhone atualizado via socket:', updatedIphone);
      // Recarregar dados para garantir sincronização
      socket.emit('get-all-iphones');
      showSnackbar('iPhone atualizado em tempo real!', 'success');
    });

    // Escutar quando um iPhone for deletado
    socket.on('iphone-deleted', (deletedId) => {
      console.log('iPhone deletado via socket:', deletedId);
      // Recarregar dados para garantir sincronização
      socket.emit('get-all-iphones');
      showSnackbar('iPhone deletado em tempo real!', 'success');
    });

    // Tratamento de erros
    socket.on('error', (error) => {
      console.error('Erro do Socket.IO no Admin:', error);
      showSnackbar('Erro de conexão com o servidor', 'error');
    });

    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('all-iphones');
      socket.off('iphone-created');
      socket.off('iphone-updated');
      socket.off('iphone-deleted');
      socket.off('error');
    };
  }, []);

  return (
    <>
      <Navigation />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Administração de iPhones
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Gerencie o catálogo de produtos
          </Typography>
        </Box>

        {/* Status de Conexão */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={isConnected ? "Socket conectado - Atualizações em tempo real ativas" : "Socket desconectado"}
            color={isConnected ? "success" : "error"}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              refreshIphones();
              showSnackbar('Recarregando dados...', 'success');
            }}
            disabled={!isConnected}
            sx={{ fontWeight: 600 }}
          >
            🔄 Atualizar Dados
          </Button>
        </Box>

        {/* Estatísticas rápidas */}
        <Box sx={{ mb: 4, display: 'flex', gap: 3 }}>
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total de Produtos
              </Typography>
              <Typography variant="h4" component="div">
                {iphones.length}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Status da Conexão
              </Typography>
              <Typography variant="h6" component="div" color={isConnected ? 'success.main' : 'error.main'}>
                {isConnected ? 'Online' : 'Offline'}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Tabela de iPhones */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Modelo</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Armazenamento</TableCell>
                  <TableCell>Cor</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        🔄 Carregando iPhones...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {iphones.map((iphone) => (
                      <TableRow key={iphone.id} hover>
                        <TableCell>{iphone.name}</TableCell>
                        <TableCell>{iphone.model}</TableCell>
                        <TableCell>R$ {iphone.price.toLocaleString()}</TableCell>
                        <TableCell>{iphone.storage}</TableCell>
                        <TableCell>{iphone.color}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleOpenDialog(iphone)} color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => deleteIphone(iphone.id!)} color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {iphones.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            📱 Nenhum iPhone encontrado
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {isConnected ? 'Clique no botão "+" para adicionar o primeiro iPhone' : 'Aguardando conexão...'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Botão flutuante para adicionar */}
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => handleOpenDialog()}
        >
          <Add />
        </Fab>

        {/* Dialog para criar/editar iPhone */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingIphone ? 'Editar iPhone' : 'Novo iPhone'}
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Nome"
                fullWidth
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />
              <TextField
                label="Modelo"
                fullWidth
                value={formData.model}
                onChange={handleInputChange('model')}
                required
              />
              <TextField
                label="Preço"
                type="number"
                fullWidth
                value={formData.price}
                onChange={handleInputChange('price')}
                required
              />
              <TextField
                label="Armazenamento"
                fullWidth
                value={formData.storage}
                onChange={handleInputChange('storage')}
                placeholder="ex: 128GB"
                required
              />
              <TextField
                label="Cor"
                fullWidth
                value={formData.color}
                onChange={handleInputChange('color')}
                required
              />
              <TextField
                label="URL da Imagem"
                fullWidth
                value={formData.image}
                onChange={handleInputChange('image')}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} variant="outlined">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingIphone ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default Admin;