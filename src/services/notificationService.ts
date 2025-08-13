export interface NotificationData {
  title: string;
  message: string;
  roomId?: string;
  timestamp?: string;
}

class NotificationService {
  public sendNotification(data: NotificationData) {
    // Always send to phone via HTTP endpoint (this is the main functionality)
    this.sendToPhone(data);
  }

  private async sendToPhone(data: NotificationData) {
    try {
      const response = await fetch('/api/send-phone-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.warn('Failed to send notification to phone');
      } else {
        console.log('Notification sent successfully to phone');
      }
    } catch (error) {
      console.error('Error sending notification to phone:', error);
    }
  }

  public requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
}

export const notificationService = new NotificationService(); 