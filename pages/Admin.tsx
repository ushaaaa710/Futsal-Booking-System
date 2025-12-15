import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../components/ui/Components';
import { INITIAL_BOOKINGS, COURTS, MOCK_USER } from '../services/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Search, Filter, MoreVertical, Download, Plus, Users, DollarSign, Trash2, Edit, BarChart2 } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'schedule' | 'users' | 'pricing'>('overview');
  
  // Mock Data for Charts
  const data = [
    { name: 'Mon', bookings: 12 },
    { name: 'Tue', bookings: 19 },
    { name: 'Wed', bookings: 15 },
    { name: 'Thu', bookings: 22 },
    { name: 'Fri', bookings: 30 },
    { name: 'Sat', bookings: 45 },
    { name: 'Sun', bookings: 38 },
  ];

  const mockUsers = [
    MOCK_USER,
    { ...MOCK_USER, id: 'u2', name: 'Sita Gurung', email: 'sita@example.np', role: 'USER' as const, walletBalance: 500 },
    { ...MOCK_USER, id: 'u3', name: 'Rabin Thapa', email: 'rabin@example.np', role: 'USER' as const, walletBalance: 5000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Admin Console</h1>
          <p className="text-gray-400">Manage courts, bookings, and platform analytics.</p>
        </div>
        <div className="flex space-x-1 overflow-x-auto pb-2 md:pb-0">
           {['overview', 'bookings', 'schedule', 'users', 'pricing'].map(tab => (
             <Button 
              key={tab} 
              variant={activeTab === tab ? 'primary' : 'outline'} 
              onClick={() => setActiveTab(tab as any)} 
              size="sm"
              className="uppercase text-xs"
             >
               {tab}
             </Button>
           ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <Card className="border-t-4 border-t-primary">
                <p className="text-xs uppercase text-gray-500 font-bold">Total Revenue</p>
                <h3 className="text-3xl font-bold mt-1">Rs. 1,24,500</h3>
             </Card>
             <Card className="border-t-4 border-t-accent">
                <p className="text-xs uppercase text-gray-500 font-bold">Total Bookings</p>
                <h3 className="text-3xl font-bold mt-1">1,240</h3>
             </Card>
             <Card className="border-t-4 border-t-white">
                <p className="text-xs uppercase text-gray-500 font-bold">Active Users</p>
                <h3 className="text-3xl font-bold mt-1">856</h3>
             </Card>
             <Card className="border-t-4 border-t-purple-500">
                <p className="text-xs uppercase text-gray-500 font-bold">Court Occupancy</p>
                <h3 className="text-3xl font-bold mt-1">78%</h3>
             </Card>
          </div>

          <Card className="h-96">
            <h3 className="text-lg font-bold mb-4 uppercase">Weekly Booking Volume</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: 0 }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: '#ffffff10' }}
                />
                <Bar dataKey="bookings" fill="#00d4ff" radius={[2, 2, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {activeTab === 'bookings' && (
        <Card className="overflow-hidden p-0">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-surface">
             <div className="flex items-center space-x-2 w-full max-w-xs">
                <Search className="text-gray-500" size={18} />
                <input type="text" placeholder="Search booking ID or name..." className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder:text-gray-600" />
             </div>
             <div className="flex space-x-2">
                <Button variant="outline" size="sm"><Filter size={16} className="mr-2" /> Filter</Button>
                <Button variant="outline" size="sm"><Download size={16} className="mr-2" /> Export</Button>
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
                {[...INITIAL_BOOKINGS, ...INITIAL_BOOKINGS, ...INITIAL_BOOKINGS].map((booking, i) => (
                  <tr key={`${booking.id}-${i}`} className="hover:bg-neutral-800/50">
                    <td className="p-4 font-mono text-gray-500">#{booking.id}</td>
                    <td className="p-4 font-medium text-white">{booking.courtName}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span>{booking.date}</span>
                        <span className="text-gray-500 text-xs">{booking.slots.join(', ')}</span>
                      </div>
                    </td>
                    <td className="p-4">Aarav Sharma</td>
                    <td className="p-4">
                      <Badge variant={booking.status === 'CONFIRMED' ? 'success' : 'warning'}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-gray-400 hover:text-white"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
             <h3 className="text-xl font-bold">Court Management</h3>
             <Button size="sm"><Plus size={16} className="mr-2" /> Add Block Time</Button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {COURTS.map(court => (
               <Card key={court.id} className="relative group">
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <h4 className="font-bold text-lg">{court.name}</h4>
                     <p className="text-sm text-gray-400">{court.type}</p>
                   </div>
                   <Badge>Rs. {court.hourlyRate}/hr</Badge>
                 </div>
                 <div className="h-2 bg-neutral-800 w-full mb-2 overflow-hidden flex">
                    {/* Mock availability visualization */}
                    <div className="h-full bg-red-500 w-[10%]" title="Booked" />
                    <div className="h-full bg-green-500 w-[20%]" title="Available" />
                    <div className="h-full bg-red-500 w-[15%]" title="Booked" />
                    <div className="h-full bg-green-500 w-[55%]" title="Available" />
                 </div>
                 <div className="flex justify-between text-xs text-gray-500 uppercase">
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>24:00</span>
                 </div>
                 
                 <div className="mt-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" className="w-full">Edit Schedule</Button>
                    <Button variant="danger" size="sm" className="w-full">Maintenance</Button>
                 </div>
               </Card>
             ))}
           </div>
        </div>
      )}

      {activeTab === 'users' && (
        <Card className="overflow-hidden p-0">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-surface">
            <h3 className="font-bold uppercase text-lg">User Management</h3>
            <Button size="sm" variant="outline"><Plus size={16} className="mr-2"/> Invite User</Button>
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
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-800/50">
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
                  <td className="p-4"><Badge variant="default">{user.role}</Badge></td>
                  <td className="p-4 font-mono text-primary">Rs. {user.walletBalance.toFixed(2)}</td>
                  <td className="p-4"><Badge variant="success">Active</Badge></td>
                  <td className="p-4 text-right">
                     <button className="text-gray-400 hover:text-white mr-2"><Edit size={16} /></button>
                     <button className="text-red-500 hover:text-red-400"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {activeTab === 'pricing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center mb-6">
              <DollarSign className="text-primary mr-2" />
              <h3 className="text-lg font-bold uppercase">Base Rates</h3>
            </div>
            <div className="space-y-4">
              {COURTS.map(court => (
                <div key={court.id} className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800">
                  <span className="font-medium">{court.name}</span>
                  <div className="flex items-center">
                    <span className="text-gray-500 text-sm mr-2">Hourly Rate (Rs):</span>
                    <input 
                      type="number" 
                      defaultValue={court.hourlyRate} 
                      className="w-20 bg-black border border-neutral-700 px-2 py-1 text-right text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4">Save Base Rates</Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center mb-6">
              <BarChart2 className="text-accent mr-2" size={20} />
              <h3 className="text-lg font-bold uppercase">Dynamic Pricing Rules</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-neutral-700 bg-neutral-900/50">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-white">Peak Hours (6PM - 10PM)</span>
                  <Badge variant="warning">+Rs. 200</Badge>
                </div>
                <p className="text-xs text-gray-500">Applies to all indoor courts on weekdays.</p>
              </div>
              
              <div className="p-4 border border-neutral-700 bg-neutral-900/50">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-white">Morning Special (6AM - 9AM)</span>
                  <Badge variant="success">-10%</Badge>
                </div>
                <p className="text-xs text-gray-500">Discount for early bird bookings.</p>
              </div>

              <Button variant="outline" className="w-full border-dashed border-neutral-600 text-gray-400 hover:text-white hover:border-white">
                <Plus size={16} className="mr-2" /> Add Pricing Rule
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
