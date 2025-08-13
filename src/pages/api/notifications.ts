import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface SocketServer extends NetServer {
  io?: SocketIOServer;
}

interface SocketWithIO extends NextApiResponse {
  socket: {
    server: SocketServer;
  } & NextApiResponse['socket'];
}

const ioHandler = (req: NextApiRequest, res: SocketWithIO) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
    });
    
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Client ${socket.id} joined room: ${roomId}`);
      });

      socket.on('send-notification', (data) => {
        const { roomId, message, title } = data;
        io.to(roomId).emit('new-notification', {
          message,
          title,
          timestamp: new Date().toISOString(),
        });
        console.log(`Notification sent to room ${roomId}:`, data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  res.end();
};

export default ioHandler; 