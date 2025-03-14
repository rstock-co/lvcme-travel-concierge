import { tool } from 'ai';
import { z } from 'zod';
import { getLatestCourseByUserId } from '@/lib/course';
import { auth } from '@/app/(auth)/auth';

export const getCourseData = tool({
  description: 'Get the user\'s latest booked CME course details',
  parameters: z.object({}), // No parameters needed
  execute: async () => {
    try {
      const session = await auth();

      if (!session || !session.user || !session.user.id) {
        return {
          error: "User not authenticated"
        };
      }

      const course = await getLatestCourseByUserId({ userId: session.user.id });

      if (!course) {
        return {
          error: "No course found for this user"
        };
      }

      return {
        courseId: course.id,
        title: course.title,
        venue: course.venue,
        venueAddress: course.venue_address,
        startDate: course.start_date.toISOString(),
        endDate: course.end_date.toISOString(),
        formattedStartDate: course.start_date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        formattedEndDate: course.end_date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        formattedStartTime: course.start_date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        formattedEndTime: course.end_date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        durationDays: Math.ceil((course.end_date.getTime() - course.start_date.getTime()) / (1000 * 60 * 60 * 24))
      };
    } catch (error) {
      console.error('Error fetching course data:', error);
      return {
        error: "Failed to retrieve course data"
      };
    }
  }
});
