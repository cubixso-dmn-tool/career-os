import WebSocket from 'ws';
import { Server as HTTPServer } from 'http';

interface WebSocketClient extends WebSocket {
  userId?: number;
  connectionId?: number;
}

class ExpertChatWebSocket {
  private wss: WebSocket.Server;
  private clients: Map<number, WebSocketClient[]> = new Map();

  constructor(server: HTTPServer) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/ws/expert-chat'
    });

    this.wss.on('connection', this.handleConnection.bind(this));
  }

  private handleConnection(ws: WebSocketClient) {
    console.log('New WebSocket connection');

    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data);
        this.handleMessage(ws, message);
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      this.removeClient(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.removeClient(ws);
    });
  }

  private handleMessage(ws: WebSocketClient, message: any) {
    switch (message.type) {
      case 'auth':
        this.authenticateClient(ws, message.userId, message.connectionId);
        break;
      
      case 'message':
        this.broadcastMessage(message);
        break;
      
      case 'typing':
        this.broadcastTyping(ws, message);
        break;
      
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private authenticateClient(ws: WebSocketClient, userId: number, connectionId: number) {
    ws.userId = userId;
    ws.connectionId = connectionId;

    // Add client to the connection room
    if (!this.clients.has(connectionId)) {
      this.clients.set(connectionId, []);
    }
    this.clients.get(connectionId)!.push(ws);

    ws.send(JSON.stringify({
      type: 'auth_success',
      message: 'Connected to chat'
    }));

    console.log(`User ${userId} joined connection ${connectionId}`);
  }

  private broadcastMessage(message: any) {
    const connectionId = message.connectionId;
    const clients = this.clients.get(connectionId);

    if (clients) {
      const messageData = JSON.stringify({
        type: 'new_message',
        message: message
      });

      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageData);
        }
      });
    }
  }

  private broadcastTyping(ws: WebSocketClient, message: any) {
    const connectionId = ws.connectionId;
    const clients = this.clients.get(connectionId!);

    if (clients) {
      const typingData = JSON.stringify({
        type: 'typing',
        userId: ws.userId,
        isTyping: message.isTyping
      });

      clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(typingData);
        }
      });
    }
  }

  private removeClient(ws: WebSocketClient) {
    if (ws.connectionId) {
      const clients = this.clients.get(ws.connectionId);
      if (clients) {
        const index = clients.indexOf(ws);
        if (index > -1) {
          clients.splice(index, 1);
        }

        if (clients.length === 0) {
          this.clients.delete(ws.connectionId);
        }
      }
    }
    console.log(`Client disconnected from connection ${ws.connectionId}`);
  }

  // Method to send message to specific connection
  public sendToConnection(connectionId: number, message: any) {
    const clients = this.clients.get(connectionId);
    if (clients) {
      const messageData = JSON.stringify(message);
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageData);
        }
      });
    }
  }
}

export default ExpertChatWebSocket;