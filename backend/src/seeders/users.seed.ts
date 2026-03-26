// User database seeder - Seeds initial users including admin and test accounts

import mongoose from "mongoose";
import "dotenv/config";
import User from "../models/User";
import { UserRole } from "../types/enums";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/courtsync";

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@courtsync.np",
    password: "admin123",
    role: UserRole.ADMIN,
    phone: "+9779800000000",
    walletBalance: 50000,
  },
  {
    name: "Aarav Sharma",
    email: "aarav@courtsync.np",
    password: "user123",
    role: UserRole.USER,
    phone: "+9779800000001",
    walletBalance: 5000,
  },
  {
    name: "Sita Thapa",
    email: "sita@courtsync.np",
    password: "user123",
    role: UserRole.USER,
    phone: "+9779800000002",
    walletBalance: 3000,
  },
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    await User.deleteMany({});
    console.log("✓ Cleared existing users");

    // Insert one by one so pre-save hook hashes passwords
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`  - ${user.name} (${user.role}) — ${user.email}`);
    }
    console.log(`✓ Seeded ${sampleUsers.length} users`);

    await mongoose.connection.close();
    console.log("✓ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("✗ Seeding failed:", error);
    process.exit(1);
  }
}

seedUsers();
