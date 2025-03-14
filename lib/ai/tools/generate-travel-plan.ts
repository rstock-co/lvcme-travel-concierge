import { tool } from 'ai';
import { z } from 'zod';
import { generateTravelPlan } from '../chains/travel-planning-chain';

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
      // Generate the travel plan using LangChain
      const travelPlanContent = await generateTravelPlan({
        courseData,
        flightData: selectedFlights,
        hotelData: selectedHotel,
        entertainmentData: selectedEntertainment,
        budget
      });

      // Calculate total cost
      const flightsCost = selectedFlights.reduce((total, flight) => total + flight.price, 0);
      const hotelCost = selectedHotel.totalPrice;
      const entertainmentCost = selectedEntertainment.reduce((total, item) => total + item.price, 0);
      const totalCost = flightsCost + hotelCost + entertainmentCost;

      return {
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
    } catch (error) {
      console.error('Error generating travel plan:', error);
      return {
        error: "Failed to generate travel plan"
      };
    }
  }
});
