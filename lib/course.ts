import { supabase } from './supabase';

export type Course = {
  id: string;
  user_id: string;
  title: string;
  venue: string;
  venue_address: string;
  start_date: Date;
  end_date: Date;
  created_at: Date;
};

export async function getLatestCourseByUserId({ userId }: { userId: string }) {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Failed to get latest course for user from database', error);
      throw error;
    }

    return data ? {
      ...data,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      created_at: new Date(data.created_at)
    } as Course : null;
  } catch (error) {
    console.error('Failed to get latest course for user from database', error);
    throw error;
  }
}
