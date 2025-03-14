import { tool } from 'ai';
import { z } from 'zod';
import { generateTravelPlan } from '../chains/travel-planning-chain';
import { logToolInvocation, logTravelPlanningChain, logError } from '@/lib/debug';

export const generateTravelPlanTool = tool({
  description: 'Generate a complete travel plan based on selected flight, hotel, and entertainment options',
  parameters: z.object({
    courseData: z.object({
      title: z.string(),
      venue: z.string(),
      venueAddress: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      formattedStartDate: z.string(),
      formattedEndDate: z.string(),
      formattedStartTime: z.string(),
      formattedEndTime: z.string()
    }),
    selectedFlights: z.array(z.object({
      airline: z.string(),
      departureTime: z.string(),
      arrivalTime: z.string(),
      origin: z.string(),
      destination: z.string(),
      price: z.number(),
      duration: z.string(),
      stops: z.number()
    })),
    selectedHotel: z.object({
      name: z.string(),
      address: z.string(),
      distanceFromVenue: z.number(),
      starRating: z.number(),
      pricePerNight: z.number(),
      totalPrice: z.number(),
      nights: z.number()
    }),
    selectedEntertainment: z.array(z.object({
      name: z.string(),
      venue: z.string(),
      date: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      price: z.number(),
      description: z.string()
    })),
    budget: z.string().optional()
  }),
  execute: async ({ courseData, selectedFlights, selectedHotel, selectedEntertainment, budget }) => {
    try {
      // Log input to travel planning chain
      const planInput = {
        courseData,
        flightData: selectedFlights,
        hotelData: selectedHotel,
        entertainmentData: selectedEntertainment,
        budget
      };

      // Generate the travel plan using LangChain
      const travelPlanContent = await generateTravelPlan(planInput);

      // Log output from travel planning chain
      logTravelPlanningChain(planInput, travelPlanContent);

      // Calculate total cost
      const flightsCost = selectedFlights.reduce((total, flight) => total + flight.price, 0);
      const hotelCost = selectedHotel.totalPrice;
      const entertainmentCost = selectedEntertainment.reduce((total, item) => total + item.price, 0);
      const totalCost = flightsCost + hotelCost + entertainmentCost;

      const result = {
        travelPlan: travelPlanContent,
        summary: {
          courseTitle: courseData.title,
          travelDates: `${courseData.formattedStartDate} to ${courseData.formattedEndDate}`,
          totalCost: totalCost,
          flightsCost: flightsCost,
          hotelCost: hotelCost,
          entertainmentCost: entertainmentCost
        }
      };

      // Log the tool invocation for debugging
      logToolInvocation('generateTravelPlan', { courseData, selectedFlights, selectedHotel, selectedEntertainment, budget }, result);

      return result;
    } catch (error) {
      logError('generateTravelPlan', error);
      return {
        error: "Failed to generate travel plan"
      };
    }
  }
});
