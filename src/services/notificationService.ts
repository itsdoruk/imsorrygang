import { io, Socket } from 'socket.io-client';

export interface NotificationData {
  title: string;
  message: string;
  roomId?: string;
  timestamp?: string;
}

class NotificationService {
  private socket: Socket | null = null;
  private roomId: string = 'default';

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    this.socket = io({
      path: '/api/socketio',
    });

    this.socket.on('connect', () => {
      console.log('Connected to notification server');
      this.joinRoom(this.roomId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification server');
    });

    this.socket.on('new-notification', (data) => {
      this.showLocalNotification(data);
    });
  }

  public joinRoom(roomId: string) {
    this.roomId = roomId;
    if (this.socket) {
      this.socket.emit('join-room', roomId);
    }
  }

  public sendNotification(data: NotificationData) {
    if (this.socket) {
      this.socket.emit('send-notification', {
        ...data,
        roomId: this.roomId,
      });
    }

    // Also send to phone via HTTP endpoint
    this.sendToPhone(data);
  }

  private async sendToPhone(data: NotificationData) {
    try {
      // You can configure this URL to point to your phone notification service
      // Options include:
      // 1. A custom app on your phone that listens to HTTP requests
      // 2. A service like Pushover, Pushbullet, or similar
      // 3. A custom webhook service
      
      const response = await fetch('/api/send-phone-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.warn('Failed to send notification to phone');
      }
    } catch (error) {
      console.error('Error sending notification to phone:', error);
    }
  }

  private showLocalNotification(data: NotificationData) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(data.title, {
        body: data.message,
        icon: '/favicon.ico',
      });
    }
  }

  public requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const notificationService = new NotificationService(); 