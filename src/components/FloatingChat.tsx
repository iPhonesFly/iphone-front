import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Users } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isCurrentUser?: boolean;
}

interface OnlineUser {
  id: string;
  name: string;
  joinedAt: Date;
}

const simulatedUsers = ['Ana Silva', 'João Santos', 'Maria Costa', 'Pedro Lima', 'Julia Oliveira'];
const simulatedMessages = [
  'Alguém sabe quando chegam os novos iPhones?',
  'Estou pensando em trocar meu celular 📱',
  'Os preços estão bons hoje!',
  'Que cor vocês recomendam?',
  'Acabei de comprar o iPhone 15 Pro Max! 🎉',
];

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isUserIdentified, setIsUserIdentified] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll para as mensagens mais recentes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simular usuários online e mensagens
  useEffect(() => {
    if (isUserIdentified) {
      // Simular usuários já online
      const initialUsers: OnlineUser[] = simulatedUsers.slice(0, Math.floor(Math.random() * 3) + 2).map((name, index) => ({
        id: `user-${index}`,
        name,
        joinedAt: new Date(Date.now() - Math.random() * 3600000), // Última hora
      }));
      
      setOnlineUsers(initialUsers);
      setOnlineCount(initialUsers.length + 1); // +1 para o usuário atual

      // Simular mensagens iniciais
      const initialMessages: Message[] = [
        {
          id: '1',
          text: `${userName} entrou no chat! 👋`,
          sender: 'Sistema',
          timestamp: new Date(),
        },
        ...initialUsers.slice(0, 2).map((user, index) => ({
          id: `msg-${index}`,
          text: simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)],
          sender: user.name,
          timestamp: new Date(Date.now() - Math.random() * 1800000), // Últimos 30 min
        }))
      ];

      setMessages(initialMessages);

      // Simular novos usuários entrando/saindo
      const userInterval = setInterval(() => {
        const shouldAdd = Math.random() > 0.7;
        if (shouldAdd && onlineUsers.length < 8) {
          const availableUsers = simulatedUsers.filter(name => 
            !onlineUsers.some(user => user.name === name) && name !== userName
          );
          if (availableUsers.length > 0) {
            const newUserName = availableUsers[Math.floor(Math.random() * availableUsers.length)];
            const newUser: OnlineUser = {
              id: `user-${Date.now()}`,
              name: newUserName,
              joinedAt: new Date(),
            };
            setOnlineUsers(prev => [...prev, newUser]);
            setOnlineCount(prev => prev + 1);
            
            setMessages(prev => [...prev, {
              id: `join-${Date.now()}`,
              text: `${newUserName} entrou no chat`,
              sender: 'Sistema',
              timestamp: new Date(),
            }]);
          }
        } else if (!shouldAdd && onlineUsers.length > 2) {
          const userToRemove = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
          setOnlineUsers(prev => prev.filter(user => user.id !== userToRemove.id));
          setOnlineCount(prev => prev - 1);
          
          setMessages(prev => [...prev, {
            id: `leave-${Date.now()}`,
            text: `${userToRemove.name} saiu do chat`,
            sender: 'Sistema',
            timestamp: new Date(),
          }]);
        }
      }, 15000 + Math.random() * 20000); // Entre 15-35 segundos

      // Simular mensagens ocasionais
      const messageInterval = setInterval(() => {
        if (onlineUsers.length > 0 && Math.random() > 0.6) {
          const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
          const randomMessage = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];
          
          setMessages(prev => [...prev, {
            id: `auto-${Date.now()}`,
            text: randomMessage,
            sender: randomUser.name,
            timestamp: new Date(),
          }]);
        }
      }, 20000 + Math.random() * 40000); // Entre 20-60 segundos

      return () => {
        clearInterval(userInterval);
        clearInterval(messageInterval);
      };
    }
  }, [isUserIdentified, userName]);

  const handleIdentify = () => {
    if (userName.trim()) {
      setIsUserIdentified(true);
    }
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() && isUserIdentified) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: currentMessage,
        sender: userName,
        timestamp: new Date(),
        isCurrentUser: true,
      };

      setMessages(prev => [...prev, newMessage]);
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

  return (
    <>
      {/* Botão flutuante */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary shadow-elegant transition-smooth hover:scale-110 hover:shadow-glow ${
          isOpen ? 'hidden' : 'flex'
        }`}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
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
            </div>
            <Button
              onClick={() => setIsOpen(false)}
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
                <div className="w-full space-y-3">
                  <Input
                    placeholder="Digite seu nome..."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-center"
                  />
                  <Button 
                    onClick={handleIdentify}
                    className="w-full"
                    disabled={!userName.trim()}
                  >
                    Iniciar Chat
                  </Button>
                </div>
              </div>
            ) : (
              // Interface de chat ativa
              <>
                {/* Área de mensagens */}
                 <ScrollArea className="flex-1 p-4">
                   <div className="space-y-3">
                     {messages.map((message) => (
                       <div
                         key={message.id}
                         className={`flex ${
                           message.sender === userName ? 'justify-end' : 'justify-start'
                         }`}
                       >
                         <div
                           className={`max-w-[80%] rounded-lg p-3 text-sm ${
                             message.isCurrentUser || message.sender === userName
                               ? 'bg-primary text-primary-foreground'
                               : message.sender === 'Sistema'
                               ? 'bg-secondary text-secondary-foreground text-center italic'
                               : 'bg-muted text-muted-foreground'
                           }`}
                         >
                           {message.sender !== 'Sistema' && message.sender !== userName && (
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
                     ))}
                     <div ref={messagesEndRef} />
                   </div>
                 </ScrollArea>

                {/* Campo de entrada */}
                <div className="p-4 border-t bg-muted/30">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      disabled={!currentMessage.trim()}
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