import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Users } from 'lucide-react';
import { getSocket } from '@/lib/socket';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
  messageType: 'user' | 'system';
  isCurrentUser?: boolean;
}

interface OnlineUser {
  id: string;
  name: string;
  joinedAt: Date;
}

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isUserIdentified, setIsUserIdentified] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll para as mensagens mais recentes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket.IO Integration
  useEffect(() => {
    const socket = getSocket();

    // Monitorar conexão
    socket.on('connect', () => {
      console.log('Chat conectado ao socket');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Chat desconectado do socket');
      setIsConnected(false);
    });

    // Verificar se já está conectado
    if (socket.connected) {
      setIsConnected(true);
    }

    // Receber histórico de mensagens
    socket.on('message-history', (historyMessages: Message[]) => {
      console.log('Recebido histórico de mensagens:', historyMessages);
      setIsLoadingHistory(false);
      
      if (historyMessages && Array.isArray(historyMessages)) {
        const formattedMessages = historyMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          isCurrentUser: msg.sender === userName && msg.messageType === 'user'
        }));
        setMessages(formattedMessages);
      }
    });

    // Receber nova mensagem
    socket.on('new-message', (newMessage: Message) => {
      console.log('Nova mensagem recebida:', newMessage);
      const formattedMessage = {
        ...newMessage,
        timestamp: new Date(newMessage.timestamp),
        isCurrentUser: newMessage.sender === userName && newMessage.messageType === 'user'
      };
      
      setMessages(prev => [...prev, formattedMessage]);
    });

    // Receber lista de usuários online
    socket.on('users-online', (data: { users: OnlineUser[], count: number }) => {
      console.log('Usuários online atualizados:', data);
      setOnlineUsers(data.users);
      setOnlineCount(data.count);
    });

    // Mensagem deletada (para administração)
    socket.on('message-deleted', (data: { id: number }) => {
      console.log('Mensagem deletada:', data.id);
      setMessages(prev => prev.filter(msg => msg.id !== data.id));
    });

    // Tratamento de erros
    socket.on('error', (error: { message: string }) => {
      console.error('Erro do Socket.IO no Chat:', error);
    });

    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message-history');
      socket.off('new-message');
      socket.off('users-online');
      socket.off('message-deleted');
      socket.off('error');
    };
  }, [userName]);

  const handleIdentify = () => {
    if (userName.trim() && isConnected) {
      setIsUserIdentified(true);
      setIsLoadingHistory(true);
      
      // Entrar no chat via Socket.IO
      const socket = getSocket();
      socket.emit('join-chat', { userName: userName.trim() });
    }
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() && isUserIdentified && isConnected) {
      const socket = getSocket();
      
      // Enviar mensagem via Socket.IO
      socket.emit('send-message', {
        text: currentMessage.trim(),
        sender: userName
      });

      setCurrentMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!isUserIdentified) {
        handleIdentify();
      } else {
        handleSendMessage();
      }
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    // Não resetar o estado quando fechar - manter a sessão ativa
  };

  return (
    <>
      {/* Botão flutuante */}
      <Button
        onClick={handleOpenChat}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary shadow-elegant transition-smooth hover:scale-110 hover:shadow-glow ${
          isOpen ? 'hidden' : 'flex'
        }`}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        {onlineCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {onlineCount}
          </Badge>
        )}
      </Button>

      {/* Interface de chat */}
      {isOpen && (
        <Card className={`fixed bottom-6 right-6 z-50 w-80 h-96 shadow-elegant transition-smooth ${
          isOpen ? 'animate-scale-in' : 'animate-scale-out'
        }`}>
          {/* Header do chat */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-primary rounded-t-lg">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-primary-foreground">Chat da Comunidade</h3>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{onlineCount}</span>
              </Badge>
              {!isConnected && (
                <Badge variant="destructive" className="text-xs">
                  Offline
                </Badge>
              )}
            </div>
            <Button
              onClick={handleCloseChat}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Conteúdo do chat */}
          <div className="flex flex-col h-80">
            {!isUserIdentified ? (
              // Tela de identificação
              <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                <MessageCircle className="h-12 w-12 text-muted-foreground" />
                <h4 className="font-medium text-center">Entre no chat da comunidade!</h4>
                <p className="text-sm text-muted-foreground text-center">
                  Converse com outros usuários sobre iPhones, dicas e muito mais.
                </p>
                
                {!isConnected && (
                  <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 text-center">
                      ⚠️ Sem conexão com o servidor. Aguarde...
                    </p>
                  </div>
                )}
                
                <div className="w-full space-y-3">
                  <Input
                    placeholder="Digite seu nome..."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-center"
                    disabled={!isConnected}
                  />
                  <Button 
                    onClick={handleIdentify}
                    className="w-full"
                    disabled={!userName.trim() || !isConnected}
                  >
                    {isConnected ? 'Iniciar Chat' : 'Aguardando conexão...'}
                  </Button>
                </div>
              </div>
            ) : (
              // Interface de chat ativa
              <>
                {/* Estado de carregamento do histórico */}
                {isLoadingHistory && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-sm text-muted-foreground">Carregando mensagens...</p>
                    </div>
                  </div>
                )}

                {/* Área de mensagens */}
                {!isLoadingHistory && (
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {messages.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Seja o primeiro a enviar uma mensagem!
                          </p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.isCurrentUser ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 text-sm ${
                                message.isCurrentUser
                                  ? 'bg-primary text-primary-foreground'
                                  : message.messageType === 'system'
                                  ? 'bg-secondary text-secondary-foreground text-center italic'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {message.messageType === 'user' && !message.isCurrentUser && (
                                <p className="text-xs font-medium mb-1 opacity-70">{message.sender}</p>
                              )}
                              <p>{message.text}</p>
                              <span className="text-xs opacity-70 mt-1 block">
                                {message.timestamp.toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                )}

                {/* Campo de entrada */}
                <div className="p-4 border-t bg-muted/30">
                  {!isConnected && (
                    <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-center">
                      <p className="text-xs text-red-600">Desconectado - mensagens não serão enviadas</p>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Input
                      placeholder={isConnected ? "Digite sua mensagem..." : "Aguardando conexão..."}
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                      disabled={!isConnected}
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      disabled={!currentMessage.trim() || !isConnected}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      )}
    </>
  );
};