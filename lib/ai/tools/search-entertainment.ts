import { tool } from 'ai';
import { z } from 'zod';

export const searchEntertainment = tool({
  description: 'Search for entertainment options in Las Vegas',
  parameters: z.object({
    date: z.string().describe('Date in YYYY-MM-DD format'),
    timeFrom: z.string().describe('Start time in HH:MM format (24h)'),
    timeTo: z.string().describe('End time in HH:MM format (24h)'),
    category: z.string().optional().describe('Entertainment category (shows, dining, sightseeing, etc.)'),
    maxDistance: z.number().optional().describe('Maximum distance from venue or hotel in miles'),
    budget: z.number().optional().describe('Maximum budget per person in USD')
  }),
  execute: async ({ date, timeFrom, timeTo, category, maxDistance, budget }) => {
    // In a real implementation, this would call your entertainment search API
    // For now, we'll return mock data

    // Mock entertainment options
    const entertainmentOptions = [
      {
        name: "Cirque du Soleil - O",
        venue: "Bellagio Hotel & Casino",
        address: "3600 S Las Vegas Blvd, Las Vegas, NV 89109",
        category: "shows",
        date: date,
        startTime: "19:30",
        endTime: "21:30",
        price: 159.99,
        description: "Aquatic masterpiece featuring world-class acrobats, synchronized swimmers, and divers.",
        distanceFromStrip: 0.0 // on the strip
      },
      {
        name: "Blue Man Group",
        venue: "Luxor Hotel & Casino",
        address: "3900 S Las Vegas Blvd, Las Vegas, NV 89119",
        category: "shows",
        date: date,
        startTime: "19:00",
        endTime: "20:30",
        price: 99.99,
        description: "Iconic performance combining comedy, music, and technology.",
        distanceFromStrip: 0.0 // on the strip
      },
      {
        name: "Gordon Ramsay Hell's Kitchen",
        venue: "Caesars Palace",
        address: "3570 S Las Vegas Blvd, Las Vegas, NV 89109",
        category: "dining",
        date: date,
        startTime: "17:00",
        endTime: "22:00",
        price: 75.00, // average per person
        description: "Upscale dining experience from celebrity chef Gordon Ramsay.",
        distanceFromStrip: 0.0 // on the strip
      },
      {
        name: "High Roller Observation Wheel",
        venue: "The LINQ Promenade",
        address: "3545 S Las Vegas Blvd, Las Vegas, NV 89109",
        category: "sightseeing",
        date: date,
        startTime: "11:30", // opens at 11:30
        endTime: "23:00", // closes at 23:00
        price: 35.00,
        description: "World's tallest observation wheel with stunning views of the Las Vegas Strip.",
        distanceFromStrip: 0.0 // on the strip
      },
      {
        name: "Fremont Street Experience",
        venue: "Downtown Las Vegas",
        address: "Fremont St, Las Vegas, NV 89101",
        category: "sightseeing",
        date: date,
        startTime: "18:00",
        endTime: "02:00",
        price: 0.00, // free
        description: "Iconic pedestrian mall with light shows, street performers, and entertainment.",
        distanceFromStrip: 3.5 // miles from strip
      }
    ];

    // Filter entertainment options by time
    const filteredByTime = entertainmentOptions.filter(option => {
      return option.startTime >= timeFrom && option.endTime <= timeTo;
    });

    // Apply other filters
    let filteredOptions = filteredByTime;

    if (category) {
      filteredOptions = filteredOptions.filter(option => option.category === category);
    }

    if (maxDistance !== undefined) {
      filteredOptions = filteredOptions.filter(option => option.distanceFromStrip <= maxDistance);
    }

    if (budget !== undefined) {
      filteredOptions = filteredOptions.filter(option => option.price <= budget);
    }

    return {
      entertainmentOptions: filteredOptions,
      totalResults: filteredOptions.length
    };
  }
});
