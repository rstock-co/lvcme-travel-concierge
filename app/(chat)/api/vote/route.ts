import { auth } from '@/app/(auth)/auth';
import { getChatById, getVotesByChatId, voteMessage } from '@/lib/db/queries';

// Temporary mock user ID for testing
const MOCK_USER_ID = 'test-user-123';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');
  const isTravelConciergeTest = searchParams.get('type') === 'travel-concierge';

  if (!chatId) {
    return new Response('chatId is required', { status: 400 });
  }

  let userId: string;

  // If this is a travel concierge test, we can bypass authentication
  if (!isTravelConciergeTest) {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (!session.user.id) {
      return new Response('User ID not found', { status: 401 });
    }

    userId = session.user.id;
  } else {
    // Use mock user ID for testing
    console.log('Using mock user ID for testing travel concierge votes');
    userId = MOCK_USER_ID;
  }

  const chat = await getChatById({ id: chatId });

  if (!chat) {
    return new Response('Chat not found', { status: 404 });
  }

  if (!isTravelConciergeTest && chat.userId !== userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const votes = await getVotesByChatId({ id: chatId });

  return Response.json(votes, { status: 200 });
}

export async function PATCH(request: Request) {
  const {
    chatId,
    messageId,
    type,
    isTravelConciergeTest = false,
  }: {
    chatId: string;
    messageId: string;
    type: 'up' | 'down';
    isTravelConciergeTest?: boolean;
  } = await request.json();

  if (!chatId || !messageId || !type) {
    return new Response('messageId and type are required', { status: 400 });
  }

  let userId: string;

  // If this is a travel concierge test, we can bypass authentication
  if (!isTravelConciergeTest) {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (!session.user.id) {
      return new Response('User ID not found', { status: 401 });
    }

    userId = session.user.id;
  } else {
    // Use mock user ID for testing
    console.log('Using mock user ID for testing travel concierge votes');
    userId = MOCK_USER_ID;
  }

  const chat = await getChatById({ id: chatId });

  if (!chat) {
    return new Response('Chat not found', { status: 404 });
  }

  if (!isTravelConciergeTest && chat.userId !== userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  await voteMessage({
    chatId,
    messageId,
    type: type,
  });

  return new Response('Message voted', { status: 200 });
}
