'use client';

import { useEffect } from 'react';
import { Message } from 'ai';

export interface TravelConciergeInitializerProps {
  chatType?: string;
  append: (message: Message) => Promise<void>;
  messages: Message[];
}

export function TravelConciergeInitializer({
  chatType,
  append,
  messages,
}: TravelConciergeInitializerProps) {
  useEffect(() => {
    // Only send the initial message if:
    // 1. This is a travel concierge chat
    // 2. There are no messages yet
    if (chatType === 'travel-concierge' && messages.length === 0) {
      const initialMessage = {
        id: 'initial-message',
        role: 'user' as const,
        content: "Hello, I need help planning my travel for my CME course in Las Vegas. The course is at the Bellagio Hotel from June 15-17, 2023, starting at 9 AM each day and ending at 5 PM. I'll be traveling from San Francisco and my budget is around $1500 for the entire trip. Can you help me find flights and accommodation?",
      };

      append(initialMessage);
    }
  }, [chatType, append, messages]);

  // This is a behavior component, not a UI component
  return null;
}
