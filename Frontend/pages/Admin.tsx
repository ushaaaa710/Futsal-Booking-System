import React, { useState, useEffect, useRef } from "react";
import { Card, Button, Input, Badge, Modal } from "../components/ui/Components";
import {
  bookingApi,
  courtApi,
  adminApi,
  userApi,
  ApiBooking,
  ApiCourt,
  ApiUser,
  DashboardStats,
  BookingAnalyticsDay,
} from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Search,
  Filter,
  MoreVertical,
  Download,
  Plus,
  Users,
  DollarSign,
  Trash2,
  Edit,
  BarChart2,
  Loader2,
  Check,
  X,
  ChevronDown,
} from "lucide-react";

interface AdminBooking {
  id: string;
  courtName: string;
  customerName: string;
  customerEmail: string;
  date: string;
  slots: string[];
  status: string;
  totalPrice: number;
}

interface AdminCourt {
  id: string;
  name: string;
  type: string;
  hourlyRate: number;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "schedule" | "users" | "pricing"
  >("overview");
  const [adminBookings, setAdminBookings] = useState<AdminBooking[]>([]);
  const [adminCourts, setAdminCourts] = useState<AdminCourt[]>([]);
  const [adminUsers, setAdminUsers] = useState<ApiUser[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<{ name: string; bookings: number }[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Booking search & actions
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('ALL');
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Court rates state (controlled inputs for pricing tab)
  const [courtRates, setCourtRates] = useState<Record<string, number>>({});
  const [savingRates, setSavingRates] = useState(false);

  // User edit modal
  const [editUser, setEditUser] = useState<ApiUser | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [savingUser, setSavingUser] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch everything in parallel
        const [bookingRes, courts, usersData, statsData, analyticsData] =
          await Promise.all([
            bookingApi.getAll({ limit: 50 }),
            courtApi.getAll(),
            adminApi.getUsers().catch(() => [] as ApiUser[]),
            adminApi.getStats().catch(() => null),
            adminApi.getBookingAnalytics(7).catch(() => [] as BookingAnalyticsDay[]),
          ]);

        // Build lookup maps
        const courtMap = new Map<string, string>();
        const mappedCourts: AdminCourt[] = courts.map((c: ApiCourt) => {
          courtMap.set(c._id, c.name);
          return {
            id: c._id,
            name: c.name,
            type: c.type,
            hourlyRate: c.hourlyRate,
          };
        });

        const userMap = new Map<string, { name: string; email: string }>();
        (usersData || []).forEach((u: ApiUser) => {
          userMap.set(u._id, { name: u.name, email: u.email });
        });

        setAdminCourts(mappedCourts);
        setAdminUsers(usersData || []);
        setStats(statsData);

        // Initialize court rates for pricing tab
        const rates: Record<string, number> = {};
        mappedCourts.forEach((c) => { rates[c.id] = c.hourlyRate; });
        setCourtRates(rates);

        // Map bookings with real customer names, skip orphaned ones
        setAdminBookings(
          (bookingRes.bookings || [])
            .filter((b: ApiBooking) => userMap.has(b.userId))
            .map((b: ApiBooking) => {
            const customer = userMap.get(b.userId)!;
            return {
              id: b._id,
              courtName: courtMap.get(b.courtId) || "Unknown",
              customerName: customer?.name || "Unknown User",
              customerEmail: customer?.email || "",
              date: b.date,
              slots: b.slots,
              status: b.status,
              totalPrice: b.totalPrice,
            };
          }),
        );

        // Map analytics to chart data
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        setChartData(
          (analyticsData || []).map((d: BookingAnalyticsDay) => {
            const date = new Date(d._id + "T00:00:00");
            return {
              name: dayNames[date.getDay()] || d._id,
              bookings: d.count,
            };
          }),
        );
      } catch {
        // Fallback to empty
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">
            Admin Console
          </h1>
          <p className="text-gray-400">
            Manage courts, bookings, and platform analytics.
          </p>
        </div>
        <div className="flex space-x-1 overflow-x-auto pb-2 md:pb-0">
          {["overview", "bookings", "schedule", "users", "pricing"].map(
            (tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "primary" : "outline"}
                onClick={() => setActiveTab(tab as any)}
                size="sm"
                className="uppercase text-xs"
              >
                {tab}
              </Button>
            ),
          )}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-t-4 border-t-primary">
              <p className="text-xs uppercase text-gray-500 font-bold">
                Total Revenue
              </p>
              <h3 className="text-3xl font-bold mt-1">
                Rs. {stats ? stats.totalRevenue.toLocaleString() : "—"}
              </h3>
            </Card>
            <Card className="border-t-4 border-t-accent">
              <p className="text-xs uppercase text-gray-500 font-bold">
                Total Bookings
              </p>
              <h3 className="text-3xl font-bold mt-1">
                {stats ? stats.totalBookings.toLocaleString() : "—"}
              </h3>
            </Card>
            <Card className="border-t-4 border-t-white">
              <p className="text-xs uppercase text-gray-500 font-bold">
                Active Users
              </p>
              <h3 className="text-3xl font-bold mt-1">
                {stats ? stats.totalUsers.toLocaleString() : "—"}
              </h3>
            </Card>
            <Card className="border-t-4 border-t-purple-500">
              <p className="text-xs uppercase text-gray-500 font-bold">
                Active Courts
              </p>
              <h3 className="text-3xl font-bold mt-1">
                {stats ? stats.totalCourts : "—"}
              </h3>
            </Card>
          </div>

          <Card className="h-96">
            <h3 className="text-lg font-bold mb-4 uppercase">
              Weekly Booking Volume
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid #333",
                    borderRadius: 0,
                  }}
                  itemStyle={{ color: "#fff" }}
                  cursor={{ fill: "#ffffff10" }}
                />
                <Bar
                  dataKey="bookings"
                  fill="#00d4ff"
                  radius={[2, 2, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {activeTab === "bookings" && (
        <Card className="overflow-hidden p-0">
          <div className="p-4 border-b border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center bg-surface gap-3">
            <div className="flex items-center space-x-2 w-full max-w-xs">
              <Search className="text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search booking ID or name..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder:text-gray-600"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 text-sm text-white px-3 py-1.5 focus:outline-none focus:border-primary"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => {
                const rows = adminBookings.map(b => `${b.id},${b.courtName},${b.customerName},${b.date},"${b.slots.join(';')}",${b.status},${b.totalPrice}`);
                const csv = 'ID,Court,Customer,Date,Slots,Status,Price\n' + rows.join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'bookings.csv'; a.click();
                URL.revokeObjectURL(url);
              }}>
                <Download size={16} className="mr-2" /> Export
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-900 text-gray-400 uppercase font-bold text-xs">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Court</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {loadingData ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      <Loader2 className="animate-spin inline mr-2" size={16} />
                      Loading bookings...
                    </td>
                  </tr>
                ) : adminBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No bookings yet.
                    </td>
                  </tr>
                ) : (
                  adminBookings
                    .filter((b) => {
                      const matchesSearch = bookingSearch === '' ||
                        b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                        b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                        b.courtName.toLowerCase().includes(bookingSearch.toLowerCase());
                      const matchesStatus = bookingStatusFilter === 'ALL' || b.status === bookingStatusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map((booking, i) => (
                    <tr
                      key={`${booking.id}-${i}`}
                      className="hover:bg-neutral-800/50"
                    >
                      <td className="p-4 font-mono text-gray-500">
                        #{booking.id.slice(-6)}
                      </td>
                      <td className="p-4 font-medium text-white">
                        {booking.courtName}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span>{booking.date}</span>
                          <span className="text-gray-500 text-xs">
                            {booking.slots.join(", ")}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">{booking.customerName}</span>
                          <span className="text-gray-500 text-xs">{booking.customerEmail}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            booking.status === "CONFIRMED" ? "success"
                              : booking.status === "COMPLETED" ? "default"
                              : booking.status === "CANCELLED" ? "danger"
                              : "warning"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right relative">
                        <button
                          className="text-gray-400 hover:text-white"
                          onClick={() => setActionMenuId(actionMenuId === booking.id ? null : booking.id)}
                        >
                          <MoreVertical size={16} />
                        </button>
                        {actionMenuId === booking.id && (
                          <div className="absolute right-4 top-12 z-50 bg-neutral-900 border border-neutral-700 shadow-xl min-w-[160px] text-left">
                            {['CONFIRMED', 'COMPLETED', 'CANCELLED'].filter(s => s !== booking.status).map((status) => (
                              <button
                                key={status}
                                className="w-full px-4 py-2 text-sm hover:bg-neutral-800 text-left text-white"
                                onClick={async () => {
                                  try {
                                    await bookingApi.updateStatus(booking.id, status);
                                    setAdminBookings((prev) => prev.map((b) => b.id === booking.id ? { ...b, status } : b));
                                  } catch (err: any) {
                                    alert(err.message || 'Failed to update status');
                                  }
                                  setActionMenuId(null);
                                }}
                              >
                                Mark as {status}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "schedule" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Court Management</h3>
            <Button size="sm">
              <Plus size={16} className="mr-2" /> Add Block Time
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminCourts.map((court) => (
              <Card key={court.id} className="relative group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{court.name}</h4>
                    <p className="text-sm text-gray-400">{court.type}</p>
                  </div>
                  <Badge>Rs. {court.hourlyRate}/hr</Badge>
                </div>
                <div className="h-2 bg-neutral-800 w-full mb-2 overflow-hidden flex">
                  <div className="h-full bg-green-500 w-full" title="Available" />
                </div>
                <div className="flex justify-between text-xs text-gray-500 uppercase">
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>

                <div className="mt-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {
                    courtApi.update(court.id, { isActive: true } as any).then(() => {
                      setAdminCourts((prev) => prev.map(c => c.id === court.id ? { ...c } : c));
                    }).catch((err: any) => alert(err.message));
                  }}>
                    Activate
                  </Button>
                  <Button variant="danger" size="sm" className="w-full" onClick={async () => {
                    if (!confirm(`Set ${court.name} to maintenance (deactivate)?`)) return;
                    try {
                      await courtApi.update(court.id, { isActive: false } as any);
                      alert(`${court.name} set to maintenance mode.`);
                    } catch (err: any) {
                      alert(err.message || 'Failed to update court');
                    }
                  }}>
                    Maintenance
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <Card className="overflow-hidden p-0">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-surface">
            <h3 className="font-bold uppercase text-lg">User Management</h3>
            <Button size="sm" variant="outline">
              <Plus size={16} className="mr-2" /> Invite User
            </Button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-gray-400 uppercase font-bold text-xs">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Wallet</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loadingData ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <Loader2 className="animate-spin inline mr-2" size={16} />
                    Loading users...
                  </td>
                </tr>
              ) : adminUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                adminUsers.map((user) => (
                <tr key={user._id} className="hover:bg-neutral-800/50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="default">{user.role}</Badge>
                  </td>
                  <td className="p-4 font-mono text-primary">
                    Rs. {(user.walletBalance ?? 0).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-gray-400 hover:text-white mr-2" onClick={() => {
                      setEditUser(user);
                      setEditUserName(user.name);
                      setEditUserPhone(user.phone || '');
                    }}>
                      <Edit size={16} />
                    </button>
                    <button className="text-red-500 hover:text-red-400" onClick={async () => {
                      if (!confirm(`Remove ${user.name}? This cannot be undone.`)) return;
                      try {
                        // No dedicated delete user endpoint — for now we just remove from the list
                        // A real app would call a DELETE /api/users/:id
                        setAdminUsers((prev) => prev.filter((u) => u._id !== user._id));
                      } catch {}
                    }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      )}

      {activeTab === "pricing" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center mb-6">
              <DollarSign className="text-primary mr-2" />
              <h3 className="text-lg font-bold uppercase">Base Rates</h3>
            </div>
            <div className="space-y-4">
              {adminCourts.map((court) => (
                <div
                  key={court.id}
                  className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800"
                >
                  <span className="font-medium">{court.name}</span>
                  <div className="flex items-center">
                    <span className="text-gray-500 text-sm mr-2">
                      Hourly Rate (Rs):
                    </span>
                    <input
                      type="number"
                      value={courtRates[court.id] ?? court.hourlyRate}
                      onChange={(e) => setCourtRates((prev) => ({ ...prev, [court.id]: Number(e.target.value) }))}
                      className="w-20 bg-black border border-neutral-700 px-2 py-1 text-right text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4" isLoading={savingRates} onClick={async () => {
                setSavingRates(true);
                try {
                  await Promise.all(
                    adminCourts.map((court) =>
                      courtApi.update(court.id, { hourlyRate: courtRates[court.id] ?? court.hourlyRate } as any)
                    )
                  );
                  setAdminCourts((prev) => prev.map(c => ({ ...c, hourlyRate: courtRates[c.id] ?? c.hourlyRate })));
                  alert('Rates saved successfully!');
                } catch (err: any) {
                  alert(err.message || 'Failed to save rates');
                } finally {
                  setSavingRates(false);
                }
              }}>Save Base Rates</Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center mb-6">
              <BarChart2 className="text-accent mr-2" size={20} />
              <h3 className="text-lg font-bold uppercase">
                Dynamic Pricing Rules
              </h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-neutral-700 bg-neutral-900/50">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-white">
                    Peak Hours (6PM - 10PM)
                  </span>
                  <Badge variant="warning">+Rs. 200</Badge>
                </div>
                <p className="text-xs text-gray-500">
                  Applies to all indoor courts on weekdays.
                </p>
              </div>

              <div className="p-4 border border-neutral-700 bg-neutral-900/50">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-white">
                    Morning Special (6AM - 9AM)
                  </span>
                  <Badge variant="success">-10%</Badge>
                </div>
                <p className="text-xs text-gray-500">
                  Discount for early bird bookings.
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full border-dashed border-neutral-600 text-gray-400 hover:text-white hover:border-white"
              >
                <Plus size={16} className="mr-2" /> Add Pricing Rule
              </Button>
            </div>
          </Card>
        </div>
      )}
      {/* Edit User Modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title={`Edit ${editUser?.name ?? 'User'}`}>
        <div className="space-y-4 py-2">
          <Input label="Name" value={editUserName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditUserName(e.target.value)} />
          <Input label="Phone" value={editUserPhone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditUserPhone(e.target.value)} placeholder="+977 ..." />
          <Button className="w-full" isLoading={savingUser} onClick={async () => {
            if (!editUser) return;
            setSavingUser(true);
            try {
              await userApi.updateProfile(editUser._id, { name: editUserName, phone: editUserPhone || undefined });
              setAdminUsers((prev) => prev.map((u) => u._id === editUser._id ? { ...u, name: editUserName, phone: editUserPhone } : u));
              setEditUser(null);
            } catch (err: any) {
              alert(err.message || 'Failed to update user');
            } finally {
              setSavingUser(false);
            }
          }}>Save Changes</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
