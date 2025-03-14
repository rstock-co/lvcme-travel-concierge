import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';
import { auth } from '@/app/(auth)/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { searchFlights } from '@/lib/ai/tools/search-flights';
import { searchHotels } from '@/lib/ai/tools/search-hotels';
import { searchEntertainment } from '@/lib/ai/tools/search-entertainment';
import { getCourseData } from '@/lib/ai/tools/get-course-data';
import { generateTravelPlanTool } from '@/lib/ai/tools/generate-travel-plan';
import { isProductionEnvironment } from '@/lib/constants';
import { NextResponse } from 'next/server';
import { myProvider } from '@/lib/ai/providers';

export const maxDuration = 60;

// Temporary mock user ID for testing
const MOCK_USER_ID = 'test-user-123';

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
      chatType,
    }: {
      id: string;
      messages: Array<Message>;
      selectedChatModel: string;
      chatType?: string;
    } = await request.json();

    // Special case for travel concierge testing
    const isTravelConciergeTest = chatType === 'travel-concierge';

    console.log(`Processing chat request: ${id}, chatType: ${chatType}, isTravelConciergeTest: ${isTravelConciergeTest}`);

    let userId: string;
    let session: any = null;

    // If this is a travel concierge test, we can bypass authentication
    if (!isTravelConciergeTest) {
      session = await auth();

      if (!session || !session.user || !session.user.id) {
        console.log('Unauthorized: No valid session');
        return new Response('Unauthorized', { status: 401 });
      }

      userId = session.user.id;
    } else {
      // Use mock user ID for testing
      console.log('Using mock user ID for testing travel concierge');
      userId = MOCK_USER_ID;
    }

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      console.log('No user message found');
      return new Response('No user message found', { status: 400 });
    }

    console.log(`User message: ${userMessage.content.substring(0, 50)}...`);

    const chat = await getChatById({ id });

    if (!chat) {
      console.log(`Creating new chat with ID: ${id}`);
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

      await saveChat({ id, userId, title });
    } else {
      if (!isTravelConciergeTest && chat.userId !== userId) {
        console.log('Unauthorized: User does not own this chat');
        return new Response('Unauthorized', { status: 401 });
      }
    }

    await saveMessages({
      messages: [{ ...userMessage, createdAt: new Date(), chatId: id }],
    });

    console.log(`Starting stream for chat: ${id}, model: ${selectedChatModel}`);

    // For travel concierge, use a specific model that works well with tools
    const modelToUse = isTravelConciergeTest ? 'chat-model-large' : selectedChatModel;

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(modelToUse),
          system: systemPrompt({ selectedChatModel: modelToUse, chatType }),
          messages,
          maxSteps: 5,
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning'
              ? []
              : [
                  'getWeather',
                  'createDocument',
                  'updateDocument',
                  'requestSuggestions',
                  'searchFlights',
                  'searchHotels',
                  'searchEntertainment',
                  'getCourseData',
                  'generateTravelPlanTool',
                ],
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
          tools: {
            getWeather,
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            requestSuggestions: requestSuggestions({
              session,
              dataStream,
            }),
            searchFlights,
            searchHotels,
            searchEntertainment,
            getCourseData,
            generateTravelPlanTool,
          },
          onFinish: async ({ response, reasoning }) => {
            try {
              console.log(`Stream finished for chat: ${id}`);
              const sanitizedResponseMessages = sanitizeResponseMessages({
                messages: response.messages,
                reasoning,
              });

              await saveMessages({
                messages: sanitizedResponseMessages.map((message) => {
                  return {
                    id: message.id,
                    chatId: id,
                    role: message.role,
                    content: message.content,
                    createdAt: new Date(),
                  };
                }),
              });
            } catch (error) {
              console.error('Failed to save chat', error);
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (error) => {
        console.error('Error in stream:', error);
        return 'Oops, an error occurred! Please try again.';
      },
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
