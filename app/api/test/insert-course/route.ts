import { auth } from '@/app/(auth)/auth';
import { insertTestCourseData } from '@/lib/course';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Try to get authenticated user
    const session = await auth();
    let userId: string;

    // If no authenticated user, check for mock user ID in request body
    if (!session || !session.user || !session.user.id) {
      // For testing: Allow mock user ID to be passed in request body
      const body = await request.json().catch(() => ({}));

      if (body.mockUserId) {
        console.log('Using mock user ID for testing:', body.mockUserId);
        userId = body.mockUserId;
      } else {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      userId = session.user.id;
    }

    await insertTestCourseData(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error inserting test course data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
