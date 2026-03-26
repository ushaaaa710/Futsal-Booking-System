// Booking database seeder - Seeds sample bookings for development and testing
// Run AFTER courts and users seeders

import mongoose from "mongoose";
import "dotenv/config";
import Court from "../models/Court";
import User from "../models/User";
import Booking from "../models/Booking";
import { BookingStatus, UserRole } from "../types/enums";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/courtsync";

async function seedBookings() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    const courts = await Court.find({});
    const users = await User.find({ role: UserRole.USER });

    if (courts.length === 0 || users.length === 0) {
      console.error("✗ Please seed courts and users first");
      process.exit(1);
    }

    await Booking.deleteMany({});
    console.log("✓ Cleared existing bookings");

    const today = new Date();
    const formatDate = (d: Date): string => d.toISOString().split("T")[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    const sampleBookings = [
      {
        userId: users[0]._id.toString(),
        courtId: courts[0]._id.toString(),
        date: formatDate(tomorrow),
        slots: ["10:00", "11:00"],
        totalPrice: courts[0].hourlyRate * 2,
        status: BookingStatus.CONFIRMED,
      },
      {
        userId: users[0]._id.toString(),
        courtId:
          courts.length > 1
            ? courts[1]._id.toString()
            : courts[0]._id.toString(),
        date: formatDate(dayAfter),
        slots: ["14:00", "15:00", "16:00"],
        totalPrice:
          (courts.length > 1 ? courts[1].hourlyRate : courts[0].hourlyRate) * 3,
        status: BookingStatus.PENDING,
      },
      {
        userId:
          users.length > 1 ? users[1]._id.toString() : users[0]._id.toString(),
        courtId: courts[0]._id.toString(),
        date: formatDate(tomorrow),
        slots: ["14:00"],
        totalPrice: courts[0].hourlyRate,
        status: BookingStatus.PENDING,
      },
      {
        userId: users[0]._id.toString(),
        courtId: courts[0]._id.toString(),
        date: formatDate(today),
        slots: ["08:00", "09:00"],
        totalPrice: courts[0].hourlyRate * 2,
        status: BookingStatus.COMPLETED,
      },
    ];

    const bookings = await Booking.insertMany(sampleBookings);
    console.log(`✓ Seeded ${bookings.length} bookings:`);
    bookings.forEach((b) => {
      console.log(
        `  - Court ${b.courtId} on ${b.date} [${b.slots.join(", ")}] — ${b.status}`,
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

seedBookings();
