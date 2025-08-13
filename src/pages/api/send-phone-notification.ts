import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    // Send to Pushover by default
    const result = await sendToPushover(title, message);

    res.status(200).json({ 
      message: 'Notification sent successfully to Pushover',
      timestamp: new Date().toISOString(),
      result
    });

  } catch (error) {
    console.error('Error sending phone notification:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
}

// Example implementation for Pushover
async function sendToPushover(title: string, message: string) {
  const PUSHOVER_TOKEN = process.env.PUSHOVER_TOKEN;
  const PUSHOVER_USER = process.env.PUSHOVER_USER;

  if (!PUSHOVER_TOKEN || !PUSHOVER_USER) {
    throw new Error('Pushover credentials not configured');
  }

  const response = await fetch('https://api.pushover.net/1/messages.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: PUSHOVER_TOKEN,
      user: PUSHOVER_USER,
      title,
      message,
      priority: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Pushover API error: ${response.statusText}`);
  }

  return response.json();
} 