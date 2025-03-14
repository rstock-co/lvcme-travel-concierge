import { tool } from 'ai';
import { z } from 'zod';

export const searchHotels = tool({
  description: 'Search for hotels near a specific location in Las Vegas',
  parameters: z.object({
    venueAddress: z.string().describe('The address of the CME course venue'),
    checkInDate: z.string().describe('Check-in date in YYYY-MM-DD format'),
    checkOutDate: z.string().describe('Check-out date in YYYY-MM-DD format'),
    starRating: z.number().optional().describe('Preferred hotel star rating (1-5)'),
    maxDistance: z.number().optional().describe('Maximum distance from venue in miles'),
    budget: z.number().optional().describe('Maximum budget per night in USD'),
    amenities: z.array(z.string()).optional().describe('Desired amenities (e.g., ["pool", "free-wifi"])')
  }),
  execute: async ({ venueAddress, checkInDate, checkOutDate, starRating, maxDistance, budget, amenities }) => {
    // In a real implementation, this would call your hotel search API
    // For now, we'll return mock data

    // Mock hotel data
    const hotels = [
      {
        name: "Bellagio Hotel & Casino",
        address: "3600 S Las Vegas Blvd, Las Vegas, NV 89109",
        distanceFromVenue: 0.8, // miles
        starRating: 5,
        pricePerNight: 299.99,
        totalPrice: 299.99 * calculateNights(checkInDate, checkOutDate),
        amenities: ["pool", "spa", "free-wifi", "restaurant", "fitness-center"],
        availableRooms: 3
      },
      {
        name: "MGM Grand Hotel & Casino",
        address: "3799 S Las Vegas Blvd, Las Vegas, NV 89109",
        distanceFromVenue: 1.2, // miles
        starRating: 4,
        pricePerNight: 189.99,
        totalPrice: 189.99 * calculateNights(checkInDate, checkOutDate),
        amenities: ["pool", "free-wifi", "restaurant", "fitness-center"],
        availableRooms: 5
      },
      {
        name: "The Venetian Resort",
        address: "3355 S Las Vegas Blvd, Las Vegas, NV 89109",
        distanceFromVenue: 0.5, // miles
        starRating: 5,
        pricePerNight: 259.99,
        totalPrice: 259.99 * calculateNights(checkInDate, checkOutDate),
        amenities: ["pool", "spa", "free-wifi", "restaurant", "fitness-center", "business-center"],
        availableRooms: 2
      },
      {
        name: "Flamingo Las Vegas Hotel & Casino",
        address: "3555 S Las Vegas Blvd, Las Vegas, NV 89109",
        distanceFromVenue: 0.9, // miles
        starRating: 3,
        pricePerNight: 119.99,
        totalPrice: 119.99 * calculateNights(checkInDate, checkOutDate),
        amenities: ["pool", "free-wifi", "restaurant"],
        availableRooms: 8
      }
    ];

    // Apply filters
    let filteredHotels = hotels;

    if (starRating) {
      filteredHotels = filteredHotels.filter(hotel => hotel.starRating >= starRating);
    }

    if (maxDistance) {
      filteredHotels = filteredHotels.filter(hotel => hotel.distanceFromVenue <= maxDistance);
    }

    if (budget) {
      filteredHotels = filteredHotels.filter(hotel => hotel.pricePerNight <= budget);
    }

    if (amenities && amenities.length > 0) {
      filteredHotels = filteredHotels.filter(hotel =>
        amenities.every(amenity => hotel.amenities.includes(amenity))
      );
    }

    // Sort by distance from venue
    filteredHotels.sort((a, b) => a.distanceFromVenue - b.distanceFromVenue);

    return {
      hotels: filteredHotels,
      totalResults: filteredHotels.length
    };
  }
});

function calculateNights(checkInDate: string, checkOutDate: string): number {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return nights > 0 ? nights : 1;
}
