import { auth } from '@/app/(auth)/auth';
import { getLatestCourseByUserId } from '@/lib/course';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get the session to verify the user
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseData } = await request.json();

    // Since we're only reading course data, we don't need to save it here
    // This endpoint can be used to verify that the user has access to course data
    // or to perform other operations related to course booking

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
