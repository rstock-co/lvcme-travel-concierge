import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import { convertToUIMessages } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { VisibilityType } from '@/components/visibility-selector';

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Await params and searchParams before accessing their properties
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);

  const id = resolvedParams.id;

  // Get the chat type from URL query params
  const chatType = resolvedSearchParams.type as string | undefined;

  // Special case for travel concierge testing
  const isTravelConciergeTest = chatType === 'travel-concierge' && !resolvedSearchParams.noTest;

  // If this is a travel concierge test, we can bypass some checks
  if (!isTravelConciergeTest) {
    const chat = await getChatById({ id });

    if (!chat) {
      return notFound();
    }

    const session = await auth();

    if (chat.visibility === 'private') {
      if (!session || !session.user) {
        return notFound();
      }

      if (session.user.id !== chat.userId) {
        return notFound();
      }
    }
  }

  const messagesFromDb = isTravelConciergeTest
    ? []
    : await getMessagesByChatId({ id });

  // Get the chat model from cookie
  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get('selectedChatModel');

  return (
    <>
      <DataStreamHandler id={id} />
      {chatModelFromCookie ? (
        <Chat
          id={id}
          initialMessages={isTravelConciergeTest ? [] : convertToUIMessages(messagesFromDb)}
          selectedChatModel={chatModelFromCookie.value}
          selectedVisibilityType={isTravelConciergeTest ? 'public' : 'private'}
          isReadonly={false}
          chatType={chatType}
        />
      ) : (
        <Chat
          id={id}
          initialMessages={isTravelConciergeTest ? [] : convertToUIMessages(messagesFromDb)}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType={isTravelConciergeTest ? 'public' : 'private'}
          isReadonly={false}
          chatType={chatType}
        />
      )}
    </>
  );
}
