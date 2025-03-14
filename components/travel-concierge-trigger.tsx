'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { generateUUID } from '@/lib/utils';

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
