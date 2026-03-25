import React, { useState, useEffect } from "react";
import { useAuth } from "../App";
import { bookingApi, courtApi, userApi, ApiBooking, ApiCourt } from "../services/api";
import { Card, Button, Badge, Modal, Input } from "../components/ui/Components";
import {
  Calendar,
  Clock,
  Banknote,
  ArrowRight,
  MapPin,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashBooking {
  id: string;
  courtName: string;
  date: string;
  slots: string[];
  totalPrice: number;
  status: string;
}

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<DashBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpError, setTopUpError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch user bookings and courts in parallel
        const [bookingRes, courts] = await Promise.all([
          bookingApi.getMy(),
          courtApi.getAll(),
        ]);
        const courtMap = new Map<string, string>();
        courts.forEach((c: ApiCourt) => courtMap.set(c._id, c.name));

        setBookings(
          (bookingRes.bookings || []).map((b: ApiBooking) => ({
            id: b._id,
            courtName: courtMap.get(b.courtId) || "Unknown Court",
            date: b.date,
            slots: b.slots,
            totalPrice: b.totalPrice,
            status: b.status,
          })),
        );
      } catch {
        // If API fails, show empty state
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const nextBooking = bookings.find(
    (b) => new Date(b.date) >= new Date() && b.status === "CONFIRMED",
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight mb-1">
            Namaste, {user?.name.split(" ")[0]}! 🙏
          </h1>
          <p className="text-gray-400">Ready to play? Find a court nearby.</p>
        </div>
        <div className="flex items-center space-x-3 bg-neutral-900 p-2 rounded-none border border-neutral-800">
          <div className="px-3">
            <p className="text-xs text-gray-500 uppercase font-bold">
              Wallet Balance
            </p>
            <p className="text-lg font-bold text-primary">
              Rs. {user?.walletBalance}
            </p>
          </div>
          <Button size="sm" variant="outline" className="h-full" onClick={() => setShowTopUp(true)}>
            + Add Funds
          </Button>
        </div>
      </div>

      {/* Hero Action Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main CTA */}
        <Card
          className="md:col-span-2 bg-gradient-to-r from-primary/20 to-surface border-primary/30 relative overflow-hidden group cursor-pointer"
          onClick={() => navigate("/book")}
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-bold uppercase mb-2 text-white">
              Book a Court Now
            </h2>
            <p className="text-gray-300 mb-6 max-w-md">
              Browse top rated futsal arenas in your area and book instant
              slots.
            </p>
            <Button className="group-hover:pl-6 transition-all">
              Find Courts <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <div className="absolute right-[-20px] bottom-[-40px] opacity-20 transform rotate-12 group-hover:rotate-6 transition-transform duration-500">
            <Calendar size={200} />
          </div>
        </Card>

        {/* Next Match Snippet */}
        <Card className="flex flex-col justify-center border-l-4 border-l-accent">
          <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">
            Next Match
          </h3>
          {nextBooking ? (
            <div>
              <p className="text-xl font-bold text-white mb-1">
                {nextBooking.courtName}
              </p>
              <div className="space-y-2 mt-2">
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar size={14} className="mr-2 text-primary" />
                  {nextBooking.date}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock size={14} className="mr-2 text-primary" />
                  {nextBooking.slots[0]}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 italic mb-2">No upcoming matches.</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/book")}
              >
                Schedule one
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold uppercase tracking-tight">
            Recent Activity
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/bookings")}
          >
            View All
          </Button>
        </div>

        <div className="bg-surface border border-neutral-800">
          <table className="w-full text-left border-collapse">
            <thead className="hidden md:table-header-group">
              <tr className="bg-neutral-900 border-b border-neutral-800 text-xs text-gray-400 uppercase">
                <th className="p-4 font-semibold">Arena</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Time</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <Loader2 className="animate-spin inline mr-2" size={16} />
                    Loading...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No bookings yet. Book a court to get started!
                  </td>
                </tr>
              ) : (
                bookings.slice(0, 3).map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors flex flex-col md:table-row p-4 md:p-0"
                  >
                    <td className="md:p-4 font-medium text-white flex justify-between md:table-cell">
                      <span className="md:hidden text-gray-500 text-xs uppercase">
                        Arena
                      </span>
                      {booking.courtName}
                    </td>
                    <td className="md:p-4 text-gray-400 flex justify-between md:table-cell">
                      <span className="md:hidden text-gray-500 text-xs uppercase">
                        Date
                      </span>
                      {booking.date}
                    </td>
                    <td className="md:p-4 text-gray-400 flex justify-between md:table-cell">
                      <span className="md:hidden text-gray-500 text-xs uppercase">
                        Time
                      </span>
                      {booking.slots.join(", ")}
                    </td>
                    <td className="md:p-4 flex justify-between md:table-cell">
                      <span className="md:hidden text-gray-500 text-xs uppercase">
                        Status
                      </span>
                      <Badge
                        variant={
                          booking.status === "CONFIRMED"
                            ? "success"
                            : booking.status === "COMPLETED"
                              ? "default"
                              : "warning"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="md:p-4 text-right font-mono flex justify-between md:table-cell items-center">
                      <span className="md:hidden text-gray-500 text-xs uppercase">
                        Price
                      </span>
                      Rs. {booking.totalPrice}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top-Up Modal */}
      <Modal isOpen={showTopUp} onClose={() => { setShowTopUp(false); setTopUpError(''); }} title="Add Funds">
        <div className="space-y-4 py-2">
          <p className="text-sm text-gray-400">Enter the amount to add to your wallet.</p>
          {topUpError && (
            <div className="p-2 bg-red-900/30 border border-red-700/50 text-red-400 text-xs font-bold uppercase">{topUpError}</div>
          )}
          <div className="flex gap-2 flex-wrap">
            {[500, 1000, 2000, 5000].map((amt) => (
              <Button key={amt} variant={topUpAmount === String(amt) ? 'primary' : 'outline'} size="sm" onClick={() => setTopUpAmount(String(amt))}>
                Rs. {amt}
              </Button>
            ))}
          </div>
          <Input
            label="Custom Amount (Rs)"
            type="number"
            min="100"
            placeholder="Enter amount"
            value={topUpAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopUpAmount(e.target.value)}
          />
          <Button
            className="w-full"
            isLoading={topUpLoading}
            disabled={!topUpAmount || Number(topUpAmount) <= 0}
            onClick={async () => {
              if (!user) return;
              setTopUpLoading(true);
              setTopUpError('');
              try {
                const updated = await userApi.topUpWallet(user.id, Number(topUpAmount));
                updateUser({ walletBalance: updated.walletBalance });
                setShowTopUp(false);
                setTopUpAmount('');
              } catch (err: any) {
                setTopUpError(err.message || 'Failed to add funds');
              } finally {
                setTopUpLoading(false);
              }
            }}
          >
            Add Rs. {topUpAmount || '0'} to Wallet
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
