'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

// Generate a UUID for chat ID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export function TravelConciergeTrigger() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if a course was just booked (this would be set by your Webflow/Wized app)
    const courseJustBooked = localStorage.getItem('courseJustBooked');

    if (courseJustBooked === 'true') {
      setIsVisible(true);
      // Clear the flag
      localStorage.removeItem('courseJustBooked');
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => {
          const chatId = generateUUID();
          router.push(`/chat/${chatId}?type=travel-concierge`);
        }}
        className="bg-primary text-primary-foreground px-4 py-2"
      >
        Plan Your Travel with AI
      </Button>
    </div>
  );
}
