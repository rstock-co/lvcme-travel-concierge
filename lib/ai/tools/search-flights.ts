import { tool } from 'ai';
import { z } from 'zod';
import { logToolInvocation, logError } from '@/lib/debug';

export const searchFlights = tool({
  description: 'Search for flights from origin to destination on specific dates',
  parameters: z.object({
    originCity: z.string().describe('Departure city name'),
    originAirport: z.string().optional().describe('Preferred departure airport code (optional)'),
    destinationCity: z.string().describe('Should be Las Vegas'),
    departureDate: z.string().describe('Departure date in YYYY-MM-DD format'),
    returnDate: z.string().describe('Return date in YYYY-MM-DD format'),
    budget: z.number().optional().describe('Maximum budget for flights in USD (optional)')
  }),
  execute: async ({ originCity, originAirport, destinationCity, departureDate, returnDate, budget }) => {
    try {
      // In a real implementation, this would call your flight search API
      // For now, we'll return mock data

      // Validate destination is Las Vegas
      if (destinationCity.toLowerCase() !== 'las vegas') {
        const errorResult = {
          error: "Destination must be Las Vegas for CME course travel planning"
        };
        logToolInvocation('searchFlights', { originCity, originAirport, destinationCity, departureDate, returnDate, budget }, errorResult);
        return errorResult;
      }

      // Mock API response
      const flightOptions = [
        {
          airline: "Southwest Airlines",
          departureTime: `${departureDate}T08:30:00`,
          arrivalTime: `${departureDate}T10:15:00`,
          origin: originAirport || `${originCity} Airport`,
          destination: "LAS",
          price: 289.99,
          duration: "1h 45m",
          stops: 0
        },
        {
          airline: "Delta Airlines",
          departureTime: `${departureDate}T10:45:00`,
          arrivalTime: `${departureDate}T12:55:00`,
          origin: originAirport || `${originCity} Airport`,
          destination: "LAS",
          price: 324.50,
          duration: "2h 10m",
          stops: 0
        },
        {
          airline: "American Airlines",
          departureTime: `${departureDate}T12:15:00`,
          arrivalTime: `${departureDate}T15:05:00`,
          origin: originAirport || `${originCity} Airport`,
          destination: "LAS",
          price: 256.75,
          duration: "2h 50m",
          stops: 1
        }
      ];

      // Return flights
      const returnFlightOptions = [
        {
          airline: "Southwest Airlines",
          departureTime: `${returnDate}T14:30:00`,
          arrivalTime: `${returnDate}T16:15:00`,
          origin: "LAS",
          destination: originAirport || `${originCity} Airport`,
          price: 295.50,
          duration: "1h 45m",
          stops: 0
        },
        {
          airline: "Delta Airlines",
          departureTime: `${returnDate}T18:20:00`,
          arrivalTime: `${returnDate}T20:35:00`,
          origin: "LAS",
          destination: originAirport || `${originCity} Airport`,
          price: 310.25,
          duration: "2h 15m",
          stops: 0
        },
        {
          airline: "American Airlines",
          departureTime: `${returnDate}T09:45:00`,
          arrivalTime: `${returnDate}T12:40:00`,
          origin: "LAS",
          destination: originAirport || `${originCity} Airport`,
          price: 275.00,
          duration: "2h 55m",
          stops: 1
        }
      ];

      // Filter by budget if specified
      let filteredOutbound = flightOptions;
      let filteredReturn = returnFlightOptions;

      if (budget) {
        filteredOutbound = flightOptions.filter(flight => flight.price <= budget/2);
        filteredReturn = returnFlightOptions.filter(flight => flight.price <= budget/2);
      }

      const result = {
        outboundFlights: filteredOutbound,
        returnFlights: filteredReturn
      };

      // Log the tool invocation for debugging
      logToolInvocation('searchFlights', { originCity, originAirport, destinationCity, departureDate, returnDate, budget }, result);

      return result;
    } catch (error) {
      logError('searchFlights', error);
      return {
        error: "Failed to search for flights"
      };
    }
  }
});
