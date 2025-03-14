'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { generateUUID } from '@/lib/utils';

export default function TestBypass() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const startTravelConcierge = () => {
    const chatId = generateUUID();
    router.push(`/chat/${chatId}?type=travel-concierge`);
  };

  return (
    <div className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Test Travel Concierge (Bypass Auth)</h1>
      <p className="text-gray-500">
        This is a temporary page for testing the travel concierge without authentication.
        Note that some features may not work properly without a valid user session.
      </p>

      <div className="flex flex-col gap-2">
        <Button onClick={startTravelConcierge}>
          Start Travel Concierge (No Auth)
        </Button>
      </div>
    </div>
  );
}
