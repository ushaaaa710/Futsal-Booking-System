// Analytics service - Dashboard statistics and revenue calculation logic

import Booking from "../models/Booking";
import Court from "../models/Court";
import User from "../models/User";
import { BookingStatus } from "../types/enums";

/**
 * Get overview stats for the admin dashboard.
 */
export const getDashboardStats = async () => {
  const [totalBookings, totalUsers, totalCourts, revenueResult] =
    await Promise.all([
      Booking.countDocuments({}),
      User.countDocuments({}),
      Court.countDocuments({ isActive: true }),
      Booking.aggregate([
        {
          $match: {
            status: {
              $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
    ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  return {
    totalBookings,
    totalUsers,
    totalCourts,
    totalRevenue,
  };
};

/**
 * Get bookings grouped by day for the last 7 days.
 */
export const getBookingsByDay = async (days: number = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const dateStr = startDate.toISOString().split("T")[0];

  return Booking.aggregate([
    { $match: { date: { $gte: dateStr } } },
    { $group: { _id: "$date", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
};
