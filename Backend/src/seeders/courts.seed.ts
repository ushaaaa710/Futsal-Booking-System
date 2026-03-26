// Court database seeder - Seeds initial courts with images, pricing, and availability

import mongoose from "mongoose";
import "dotenv/config";
import Court from "../models/Court";
import { CourtType } from "../types/enums";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/courtsync";

const sampleCourts = [
  {
    name: "Main Arena",
    type: CourtType.INDOOR,
    hourlyRate: 1500,
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800",
    location: "Kathmandu",
    openTime: "06:00",
    closeTime: "22:00",
    isActive: true,
  },
  {
    name: "Training Ground",
    type: CourtType.OUTDOOR,
    hourlyRate: 1000,
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
    location: "Lalitpur",
    openTime: "06:00",
    closeTime: "20:00",
    isActive: true,
  },
  {
    name: "Champions Court",
    type: CourtType.INDOOR,
    hourlyRate: 2000,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    location: "Bhaktapur",
    openTime: "08:00",
    closeTime: "22:00",
    isActive: true,
  },
  {
    name: "Rooftop Pitch",
    type: CourtType.OUTDOOR,
    hourlyRate: 1200,
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800",
    location: "Kathmandu",
    openTime: "07:00",
    closeTime: "21:00",
    isActive: true,
  },
];

async function seedCourts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    await Court.deleteMany({});
    console.log("✓ Cleared existing courts");

    const courts = await Court.insertMany(sampleCourts);
    console.log(`✓ Seeded ${courts.length} courts:`);
    courts.forEach((court) => {
      console.log(
        `  - ${court.name} (${court.type}) — Rs. ${court.hourlyRate}/hr`,
      );
    });

    await mongoose.connection.close();
    console.log("✓ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("✗ Seeding failed:", error);
    process.exit(1);
  }
}

seedCourts();
