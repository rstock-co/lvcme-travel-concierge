'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { generateUUID } from '@/lib/utils';

// Temporary mock user ID for testing when authentication fails
const MOCK_USER_ID = 'test-user-123';

export default function TestTravelConcierge() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const insertTestCourse = async () => {
    setIsLoading(true);
    try {
      // Direct API call with mock user ID for testing
      const response = await fetch('/api/test/insert-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mockUserId: MOCK_USER_ID })
      });

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

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p className="font-bold">Testing Mode</p>
        <p>Authentication is bypassed for testing purposes.</p>
      </div>

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
