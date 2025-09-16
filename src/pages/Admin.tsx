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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Close,
} from '@mui/icons-material';
import Navigation from "@/components/Navigation";
import api from '@/lib/api';

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
  const [formData, setFormData] = useState<iPhone>({
    name: '',
    model: '',
    price: 0,
    storage: '',
    color: '',
    image: '',
  });

  // Buscar todos os iPhones
  const fetchIphones = async () => {
    try {
      const response = await api.get('/iphones');
      setIphones(response.data);
    } catch (error) {
      console.error('Erro ao buscar iPhones:', error);
      showSnackbar('Erro ao carregar iPhones', 'error');
    }
  };

  // Criar novo iPhone
  const createIphone = async (iphone: iPhone) => {
    try {
      await api.post('/iphones', iphone);
      fetchIphones();
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
      await api.put(`/iphones/${id}`, iphone);
      fetchIphones();
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
        await api.delete(`/iphones/${id}`);
        fetchIphones();
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
    fetchIphones();
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

        {/* Estatísticas rápidas */}
        <Box sx={{ mb: 4 }}>
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total de Produtos
              </Typography>
              <Typography variant="h4" component="div">
                {iphones.length}
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
                        Nenhum iPhone encontrado
                      </Typography>
                    </TableCell>
                  </TableRow>
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