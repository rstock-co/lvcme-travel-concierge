'use client';

import { useEffect } from 'react';
import { Message } from 'ai';

interface TravelConciergeInitializerProps {
  chatType?: string;
  append: (message: Message) => Promise<string | null | undefined>;
  messages: Array<Message>;
}

export function TravelConciergeInitializer({
  chatType,
  append,
  messages
}: TravelConciergeInitializerProps) {
  useEffect(() => {
    const initializeChat = async () => {
      if (chatType === 'travel-concierge' && messages.length === 0) {
        // Send an initial message to the AI to trigger the welcome flow
        await append({
          id: '',
          role: 'user',
          content: 'Hello, I need help planning my travel for my CME course in Las Vegas.',
        });
      }
    };

    initializeChat();
  }, [chatType, append, messages]);

  return null; // This is a behavior component, not a UI component
}
