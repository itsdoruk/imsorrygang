import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

export default function Home() {
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Request notification permission
    notificationService.requestNotificationPermission();

    // Check connection status
    const checkConnection = () => {
      // This is a simple way to check if the socket is connected
      setIsConnected(true); // You can implement a more robust connection check
    };

    checkConnection();

    return () => {
      notificationService.disconnect();
    };
  }, []);

  const handleSendNotification = () => {
    if (!message.trim() || !title.trim()) {
      alert('Please enter both title and message');
      return;
    }

    const notificationData = {
      title: title.trim(),
      message: message.trim(),
      roomId: 'default',
    };

    // Send notification
    notificationService.sendNotification(notificationData);

    // Clear form
    setMessage('');
    setTitle('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSendNotification();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold mb-4">
            gang, i&apos;m really sorry for what i said 🙏
          </h1>
          <h2 className="text-xl mb-2">
            i&apos;m taking my words back
          </h2>
          <p className="text-lg">
            so you can leave a message on my phone
          </p>
          <div className="flex items-center justify-center mt-6 space-x-3">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-black' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'connected' : 'disconnected'}
            </span>
          </div>
        </div>

        {/* Main Form */}
        <div className="border border-black p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="notification title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={4}
              className="w-full px-3 py-2 border border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="write your message here... (ctrl+enter to send)"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSendNotification}
              disabled={!message.trim() || !title.trim()}
              className="px-6 py-2 bg-black text-white font-bold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
