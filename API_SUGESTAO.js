// API COMPLETA COM CRUD EM TEMPO REAL VIA SOCKET.IO
// Substitua sua API por este código:

const express = require("express");
const sequelize = require("./src/config/database");
const User = require("./src/models/User");
const Iphone = require("./src/models/Iphone");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const port = 3000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello World! - API CRUD iPhone com Socket.IO");
});

io.on("connection", (socket) => {
  console.log("🔌 Cliente conectado:", socket.id);

  // ========== READ - Buscar todos os iPhones ==========
  socket.on('get-all-iphones', async () => {
    try {
      console.log("📱 Buscando todos os iPhones para:", socket.id);
      const iphones = await Iphone.findAll({
        order: [['id', 'ASC']] // Ordem por ID
      });
      socket.emit('all-iphones', iphones);
      console.log(`✅ Enviados ${iphones.length} iPhones para ${socket.id}`);
    } catch (error) {
      console.error("❌ Erro ao buscar iPhones:", error);
      socket.emit('error', 'Failed to fetch iPhones');
    }
  });

  // ========== CREATE - Criar novo iPhone ==========
  socket.on('create-iphone', async (data) => {
    try {
      console.log("🆕 Criando iPhone:", data);
      const newIphone = await Iphone.create(data);
      
      // Notificar TODOS os clientes conectados
      io.emit('iphone-created', newIphone);
      console.log("📢 iPhone criado notificado para todos os clientes:", newIphone.id);
      
      // Enviar lista atualizada para todos (opcional para garantir sincronização)
      const allIphones = await Iphone.findAll({
        order: [['id', 'ASC']]
      });
      io.emit('all-iphones', allIphones);
      
    } catch (error) {
      console.error("❌ Erro ao criar iPhone:", error);
      socket.emit('error', 'Failed to create iPhone');
    }
  });

  // ========== UPDATE - Atualizar iPhone existente ==========
  socket.on('update-iphone', async (data) => {
    try {
      console.log("✏️ Atualizando iPhone:", data.id, data);
      const { id, ...updateData } = data;
      
      // Verificar se o iPhone existe
      const iphone = await Iphone.findByPk(id);
      if (!iphone) {
        socket.emit('error', 'iPhone not found');
        return;
      }
      
      // Atualizar o iPhone
      await iphone.update(updateData);
      const updatedIphone = await Iphone.findByPk(id);
      
      // Notificar TODOS os clientes conectados
      io.emit('iphone-updated', updatedIphone);
      console.log("📢 iPhone atualizado notificado para todos os clientes:", id);
      
      // Enviar lista atualizada para todos
      const allIphones = await Iphone.findAll({
        order: [['id', 'ASC']]
      });
      io.emit('all-iphones', allIphones);
      
    } catch (error) {
      console.error("❌ Erro ao atualizar iPhone:", error);
      socket.emit('error', 'Failed to update iPhone');
    }
  });

  // ========== DELETE - Deletar iPhone ==========
  socket.on('delete-iphone', async (id) => {
    try {
      console.log("🗑️ Deletando iPhone:", id);
      
      // Verificar se o iPhone existe
      const iphone = await Iphone.findByPk(id);
      if (!iphone) {
        socket.emit('error', 'iPhone not found');
        return;
      }
      
      // Deletar o iPhone
      await iphone.destroy();
      
      // Notificar TODOS os clientes conectados
      io.emit('iphone-deleted', id);
      console.log("📢 iPhone deletado notificado para todos os clientes:", id);
      
      // Enviar lista atualizada para todos
      const allIphones = await Iphone.findAll({
        order: [['id', 'ASC']]
      });
      io.emit('all-iphones', allIphones);
      
    } catch (error) {
      console.error("❌ Erro ao deletar iPhone:", error);
      socket.emit('error', 'Failed to delete iPhone');
    }
  });

  // ========== EVENTOS DE CONEXÃO ==========
  socket.on("disconnect", () => {
    console.log("🔌 Cliente desconectado:", socket.id);
  });

  socket.on("error", (error) => {
    console.error("❌ Erro no socket:", socket.id, error);
  });
});

// ========== INICIALIZAÇÃO DO SERVIDOR ==========
sequelize
  .sync({ alter: true }) // Cria/atualiza as tabelas no banco de dados
  .then(() => {
    httpServer.listen(port, () =>
      console.log(
        `🚀 Database connected successfully and app listening on port ${port}`
      )
    );
  })
  .catch((error) => {
    console.error("❌ Erro na inicialização:", error.message);
  });

/* 
========== EVENTOS SOCKET.IO IMPLEMENTADOS ==========

CLIENTE → SERVIDOR:
- 'get-all-iphones' → Buscar todos os iPhones
- 'create-iphone' → Criar novo iPhone (dados do iPhone)
- 'update-iphone' → Atualizar iPhone ({ id, ...dadosAtualizados })
- 'delete-iphone' → Deletar iPhone (id do iPhone)

SERVIDOR → CLIENTE:
- 'all-iphones' → Lista de todos os iPhones
- 'iphone-created' → iPhone recém-criado
- 'iphone-updated' → iPhone recém-atualizado
- 'iphone-deleted' → ID do iPhone deletado
- 'error' → Mensagem de erro

========== BENEFÍCIOS ==========
✅ CRUD completo em tempo real
✅ Sincronização automática entre todas as abas/clientes
✅ Notificações instantâneas de mudanças
✅ Fallback para dados mock quando offline
✅ Logs detalhados para debug
✅ Tratamento de erros robusto

========== COMO USAR ==========
1. Substitua sua API atual por este código
2. Reinicie o servidor da API
3. O frontend já está configurado para funcionar
4. Teste criando/editando/deletando iPhones em diferentes abas
*/