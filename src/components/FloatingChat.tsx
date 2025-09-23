import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isUserIdentified, setIsUserIdentified] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const handleIdentify = () => {
    if (userName.trim()) {
      setIsUserIdentified(true);
      setMessages([
        {
          id: '1',
          text: `Olá ${userName}! Como posso ajudá-lo hoje?`,
          sender: 'Sistema',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() && isUserIdentified) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: currentMessage,
        sender: userName,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newMessage]);
      setCurrentMessage('');

      // Simular resposta automática
      setTimeout(() => {
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Obrigado pela sua mensagem! Em breve retornaremos o contato.',
          sender: 'Sistema',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, autoReply]);
      }, 1000);
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
            <h3 className="font-semibold text-primary-foreground">Chat de Suporte</h3>
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
                <h4 className="font-medium text-center">Bem-vindo ao nosso chat!</h4>
                <p className="text-sm text-muted-foreground text-center">
                  Por favor, informe seu nome para começarmos a conversa.
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
                            message.sender === userName
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
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