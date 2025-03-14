import { auth } from '@/app/(auth)/auth';
import { insertTestCourseData } from '@/lib/course';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await insertTestCourseData(session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error inserting test course data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
