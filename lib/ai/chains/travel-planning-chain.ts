import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Define template for generating a complete travel plan
const travelPlanTemplate = `
You are an AI travel planner for medical professionals attending CME courses in Las Vegas.

Course Information:
- Title: {courseTitle}
- Venue: {courseVenue}
- Address: {courseAddress}
- Start Date: {courseStartDate}
- End Date: {courseEndDate}
- Start Time: {courseStartTime}
- End Time: {courseEndTime}

Selected Flight Information:
{flightDetails}

Selected Hotel Information:
{hotelDetails}

Selected Entertainment Options:
{entertainmentDetails}

Total Budget: {budget}

Please create a comprehensive travel itinerary for the user, including:
1. A day-by-day schedule
2. Transportation details
3. Important notes and reminders
4. A total cost breakdown

Make sure the schedule accommodates the course timing as the primary priority.
Format this as a professionally structured travel plan.
`;

export const createTravelPlanningChain = () => {
  // Initialize OpenAI model
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
  });

  // Create the prompt template
  const prompt = PromptTemplate.fromTemplate(travelPlanTemplate);

  // Create the chain
  const chain = RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser(),
  ]);

  return chain;
};

// Function to run the chain with complete travel data
export const generateTravelPlan = async ({
  courseData,
  flightData,
  hotelData,
  entertainmentData,
  budget
}: {
  courseData: any;
  flightData: any;
  hotelData: any;
  entertainmentData: any;
  budget?: string;
}) => {
  const chain = createTravelPlanningChain();

  // Format flight details
  const flightDetails = flightData.map((flight: any) =>
    `- ${flight.airline} from ${flight.origin} to ${flight.destination}
     - Departure: ${new Date(flight.departureTime).toLocaleString()}
     - Arrival: ${new Date(flight.arrivalTime).toLocaleString()}
     - Price: $${flight.price}`
  ).join('\n\n');

  // Format hotel details
  const hotelDetails = `
  - Name: ${hotelData.name}
  - Address: ${hotelData.address}
  - Distance from venue: ${hotelData.distanceFromVenue} miles
  - Price per night: $${hotelData.pricePerNight}
  - Total price (${hotelData.nights} nights): $${hotelData.totalPrice}
  `;

  // Format entertainment details
  const entertainmentDetails = entertainmentData.map((entertainment: any) =>
    `- ${entertainment.name} at ${entertainment.venue}
     - Date: ${entertainment.date}
     - Time: ${entertainment.startTime} - ${entertainment.endTime}
     - Price: $${entertainment.price}
     - Description: ${entertainment.description}`
  ).join('\n\n');

  // Run the chain
  const result = await chain.invoke({
    courseTitle: courseData.title,
    courseVenue: courseData.venue,
    courseAddress: courseData.venueAddress,
    courseStartDate: courseData.formattedStartDate,
    courseEndDate: courseData.formattedEndDate,
    courseStartTime: courseData.formattedStartTime,
    courseEndTime: courseData.formattedEndTime,
    flightDetails,
    hotelDetails,
    entertainmentDetails,
    budget: budget || "Not specified"
  });

  return result;
};
