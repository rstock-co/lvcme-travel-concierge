'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { generateUUID } from '@/lib/utils';

export default function TestTravelConcierge() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const insertTestCourse = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test/insert-course', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to insert test course');
      }
      alert('Test course inserted successfully!');
    } catch (error) {
      console.error('Error inserting test course:', error);
      alert('Failed to insert test course');
    } finally {
      setIsLoading(false);
    }
  };

  const startTravelConcierge = () => {
    const chatId = generateUUID();
    router.push(`/chat/${chatId}?type=travel-concierge`);
  };

  return (
    <div className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Test Travel Concierge</h1>

      <div className="flex flex-col gap-2">
        <Button
          onClick={insertTestCourse}
          disabled={isLoading}
        >
          {isLoading ? 'Inserting...' : 'Insert Test Course Data'}
        </Button>

        <Button onClick={startTravelConcierge}>
          Start Travel Concierge
        </Button>
      </div>
    </div>
  );
}
