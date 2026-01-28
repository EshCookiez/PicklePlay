import React from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  ShoppingBag,
  DollarSign,
  FileText,
  CreditCard,
  MoreHorizontal,
  ChevronDown,
  ArrowRight,
  Package,
  Clock,
  Users
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

// Data for Area Chart (Sales Analytics)
const SALES_DATA = [
  { name: '1', value: 140 },
  { name: '5', value: 160 },
  { name: '10', value: 150 },
  { name: '13', value: 200 }, // Peak 1
  { name: '15', value: 180 },
  { name: '20', value: 240 }, // Peak 2 (Highest)
  { name: '25', value: 170 },
  { name: '30', value: 190 },
];

// Data for Donut Chart (Total Performance)
const PERFORMANCE_DATA = [
  { name: 'Affiliate', value: 55, color: '#052e16' }, // Dark Green
  { name: 'Direct', value: 15, color: '#16a34a' },     // Medium Green
  { name: 'Absence', value: 35, color: '#a3e635' },    // Lime
  { name: 'Other', value: 9, color: '#fbbf24' },       // Yellow
];

// Data for Gauge (Total Visitor)
const VISITOR_DATA = [
  { name: 'Used', value: 70 },
  { name: 'Remaining', value: 30 },
];

// Mock Recent Orders
const ORDERS = [
  { id: '#212884', product: 'Pro Pickleball Paddle', date: 'Jan 31, 2025', price: '$56.00', status: 'On Progress', img: 'https://images.unsplash.com/photo-1591123720164-de1348028a82?w=100&h=100&fit=crop' },
  { id: '#222368', product: 'Court Sport Shoes', date: 'Feb 11, 2025', price: '$165.00', status: 'Pending', img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop' },
  { id: '#212456', product: 'Pickleball Net Set', date: 'Feb 14, 2025', price: '$120.50', status: 'Completed', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=100&h=100&fit=crop' },
];

export default function AdminOverview() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
            
            {/* Hero Banner Section */}
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-[#1E40AF] via-[#1e3a8a] to-[#064e3b] text-white shadow-2xl">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDE047] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FDE047] rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black mb-3">Dashboard Overview</h1>
                    <p className="text-lg text-white/80 mb-6 max-w-2xl">Welcome back! Here's your complete admin dashboard with real-time analytics and performance metrics.</p>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-[#FDE047] text-[#1E40AF] font-bold px-6 py-3 rounded-xl hover:bg-yellow-200 transition-colors">View Reports</button>
                        <button className="bg-white/20 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30">Download Data</button>
                    </div>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               
               {/* Card 1: Total Sales (Blue with Gold Accent) */}
               <div className="bg-white rounded-3xl p-6 text-slate-900 relative overflow-hidden shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#FDE047] opacity-10 rounded-full blur-2xl"></div>
                  <div className="flex justify-between items-start mb-6 relative z-10">
                     <span className="font-bold text-[#1E40AF] text-sm uppercase tracking-wider">Total Sales</span>
                     <div className="p-3 bg-blue-50 rounded-full border-2 border-[#FDE047]">
                        <ShoppingBag size={20} className="text-[#1E40AF]" />
                     </div>
                  </div>
                  <div className="relative z-10 pb-4 border-b-4 border-[#FDE047]">
                     <h3 className="text-4xl font-black mb-3 text-[#1E40AF]">$564.00</h3>
                     <div className="flex items-center gap-2">
                        <span className="bg-[#FDE047] text-[#1E40AF] px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wide flex items-center gap-1">
                           +15%
                        </span>
                        <span className="text-xs font-bold text-slate-500">from last month</span>
                     </div>
                  </div>
               </div>

               {/* Card 2: Profit (Blue Accent) */}
               <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-[#1E40AF] text-sm uppercase tracking-wider">Profit</span>
                     <div className="p-3 bg-blue-50 rounded-full">
                        <DollarSign size={20} className="text-[#1E40AF]" />
                     </div>
                  </div>
                  <div className="pb-4 border-b-2 border-slate-100">
                     <h3 className="text-4xl font-black text-[#1E40AF] mb-2">45%</h3>
                     <div className="flex items-center gap-2">
                        <span className="text-red-600 font-bold text-xs flex items-center">
                           -15% <TrendingDown size={12} className="ml-1" />
                        </span>
                        <span className="text-xs font-bold text-slate-500">from last month</span>
                     </div>
                  </div>
               </div>

                {/* Card 3: Invoice (Green Accent) */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-[#064e3b] text-sm uppercase tracking-wider">Invoice</span>
                     <div className="p-3 bg-green-50 rounded-full">
                        <FileText size={20} className="text-[#064e3b]" />
                     </div>
                  </div>
                  <div className="pb-4 border-b-2 border-slate-100">
                     <h3 className="text-4xl font-black text-[#064e3b] mb-2">1,673</h3>
                     <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold text-xs flex items-center">
                           +21% <TrendingUp size={12} className="ml-1" />
                        </span>
                        <span className="text-xs font-bold text-slate-500">from last month</span>
                     </div>
                  </div>
               </div>

                {/* Card 4: Revenue (Yellow Accent) */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-yellow-100 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-amber-700 text-sm uppercase tracking-wider">Revenue</span>
                     <div className="p-3 bg-yellow-50 rounded-full">
                        <CreditCard size={20} className="text-amber-700" />
                     </div>
                  </div>
                  <div className="pb-4 border-b-2 border-slate-100">
                     <h3 className="text-4xl font-black text-amber-700 mb-2">$655.70</h3>
                     <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold text-xs flex items-center">
                           +11% <TrendingUp size={12} className="ml-1" />
                        </span>
                        <span className="text-xs font-bold text-slate-500">from last month</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Middle Row (Charts) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               
               {/* Left: Sales Analytics Graph */}
               <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-lg border border-blue-100 relative">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                       <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-black text-2xl text-[#1E40AF]">Sales Analytics</h3>
                          <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-[#1E40AF]"></div>
                              <div className="w-3 h-3 rounded-full bg-[#FDE047]"></div>
                          </div>
                       </div>
                       <p className="text-sm text-slate-600 font-semibold">Real-time performance metrics</p>
                     </div>
                     <div className="flex items-center gap-2 text-sm font-bold text-[#1E40AF] bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                        March 2025 <ChevronDown size={14} />
                     </div>
                  </div>
                  
                  {/* Floating Tooltip Mockup */}
                  <div className="absolute top-[40%] left-[45%] bg-white p-4 rounded-xl shadow-2xl z-20 border border-blue-200 animate-in fade-in zoom-in duration-500 hidden md:block">
                     <div className="text-xs text-[#1E40AF] font-bold uppercase mb-2">Net Income</div>
                     <div className="text-2xl font-black text-[#1E40AF]">$220,342,123</div>
                  </div>

                  <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={SALES_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                           <defs>
                              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.2}/>
                                 <stop offset="95%" stopColor="#1E40AF" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorSalesStroke" x1="0" y1="0" x2="1" y2="0">
                                 <stop offset="0%" stopColor="#FDE047" />
                                 <stop offset="50%" stopColor="#1E40AF" />
                                 <stop offset="100%" stopColor="#064e3b" />
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#1E40AF', fontSize: 12, fontWeight: 700 }} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fill: '#1E40AF', fontSize: 12, fontWeight: 700 }} tickFormatter={(val) => `${val}M`} domain={[140, 260]} /> 
                           <Tooltip contentStyle={{ borderRadius: '12px', border: '2px solid #1E40AF', boxShadow: '0 10px 25px rgba(30, 64, 175, 0.2)', backgroundColor: '#f0f9ff' }} />
                           <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="url(#colorSalesStroke)" 
                              strokeWidth={3} 
                              fillOpacity={1} 
                              fill="url(#colorSales)" 
                           />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* Right: Total Performance Donut */}
               <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h3 className="font-black text-2xl text-[#064e3b] mb-1">Performance</h3>
                        <p className="text-xs text-slate-600 font-semibold">Program distribution</p>
                     </div>
                     <button className="text-slate-400 hover:text-[#1E40AF] transition-colors"><MoreHorizontal size={20} /></button>
                  </div>

                  <div className="relative h-[220px] flex items-center justify-center -mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={PERFORMANCE_DATA}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                              stroke="none"
                           >
                              {PERFORMANCE_DATA.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                           </Pie>
                        </PieChart>
                     </ResponsiveContainer>
                     {/* Center Graphic Icon (User) */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-blue-50 p-3 rounded-full border-2 border-[#1E40AF]">
                           <Users size={24} className="text-[#1E40AF]" />
                        </div>
                     </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-3 mt-4">
                     {PERFORMANCE_DATA.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-slate-50 transition-colors">
                           <div className="flex items-center gap-3">
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                              <span className="font-bold text-slate-700">{item.name}</span>
                           </div>
                           <span className="font-bold text-[#1E40AF]">{item.value}%</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               
               {/* Recent Orders Table */}
               <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                     <div>
                        <h3 className="font-black text-2xl text-[#1E40AF] mb-1">Recent Orders</h3>
                        <p className="text-sm text-slate-600 font-semibold">Latest transactions</p>
                     </div>
                     <button className="text-sm font-black text-[#1E40AF] hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">View all</button>
                  </div>
                  
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="border-b-2 border-[#FDE047]">
                              <th className="pb-4 pl-0 text-xs font-black uppercase text-[#1E40AF] tracking-wider">#</th>
                              <th className="pb-4 text-xs font-black uppercase text-[#1E40AF] tracking-wider pl-4">Product</th>
                              <th className="pb-4 text-xs font-black uppercase text-[#1E40AF] tracking-wider">Date</th>
                              <th className="pb-4 text-xs font-black uppercase text-[#1E40AF] tracking-wider">Price</th>
                              <th className="pb-4 text-xs font-black uppercase text-[#1E40AF] tracking-wider">Status</th>
                              <th className="pb-4 text-xs font-black uppercase text-[#1E40AF] tracking-wider text-right pr-0">Action</th>
                           </tr>
                        </thead>
                        <tbody className="text-sm">
                           {ORDERS.map((order, i) => (
                              <tr key={i} className="group hover:bg-blue-50 transition-colors border-b border-slate-100">
                                 <td className="py-4 pl-0 font-bold text-[#1E40AF]">
                                    <div className="flex items-center gap-3">
                                       <div className="w-5 h-5 rounded border-2 border-[#1E40AF] flex items-center justify-center bg-blue-50 text-transparent">
                                          {i === 0 && <div className="w-3 h-3 bg-[#1E40AF] rounded-sm"></div>}
                                       </div>
                                       {i + 1}
                                    </div>
                                 </td>
                                 <td className="py-4 pl-4">
                                    <div className="flex items-center gap-3">
                                       <img src={order.img} className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                                       <div>
                                          <div className="font-bold text-[#1E40AF]">{order.product}</div>
                                          <div className="text-xs font-bold text-slate-500">{order.id}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="py-4 font-bold text-slate-600">{order.date}</td>
                                 <td className="py-4 font-black text-[#1E40AF]">{order.price}</td>
                                 <td className="py-4">
                                    <span className={`
                                       px-3 py-2 rounded-lg text-xs font-black capitalize
                                       ${order.status === 'On Progress' ? 'bg-blue-100 text-[#1E40AF]' : 
                                         order.status === 'Pending' ? 'bg-yellow-100 text-amber-800' : 
                                         'bg-green-100 text-[#064e3b]'}
                                    `}>
                                       {order.status}
                                    </span>
                                 </td>
                                 <td className="py-4 text-right pr-0">
                                    <button className="text-slate-400 hover:text-[#1E40AF] transition-colors"><MoreHorizontal size={18} /></button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Total Visitor & Activity Column */}
               <div className="space-y-6">
                  {/* Visitor Gauge */}
                  <div className="bg-white rounded-3xl p-6 shadow-lg border border-emerald-100 relative">
                     <div className="flex justify-between items-center mb-4">
                        <div>
                           <h3 className="font-black text-lg text-[#064e3b] mb-1">Total Visitors</h3>
                           <p className="text-xs text-slate-600 font-semibold">Traffic distribution</p>
                        </div>
                        <button className="text-slate-400 hover:text-[#1E40AF]"><MoreHorizontal size={18}/></button>
                     </div>
                     
                     <div className="h-[160px] relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie
                                 data={VISITOR_DATA}
                                 cx="50%"
                                 cy="80%"
                                 startAngle={180}
                                 endAngle={0}
                                 innerRadius={60}
                                 outerRadius={80}
                                 paddingAngle={0}
                                 dataKey="value"
                                 cornerRadius={6}
                                 stroke="none"
                              >
                                 <Cell key="cell-0" fill="#1E40AF" />
                                 <Cell key="cell-1" fill="#dbeafe" />
                              </Pie>
                           </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                           <div className="text-4xl font-black text-[#1E40AF]">70%</div>
                        </div>
                     </div>
                     
                     <div className="space-y-3 mt-0">
                        {[
                           { name: 'Website', val: '55%' },
                           { name: 'Facebook', val: '35%' },
                           { name: 'Instagram', val: '15%' },
                        ].map((stat, i) => (
                           <div key={i} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-blue-50 transition-colors">
                              <span className="flex items-center gap-3 font-bold text-slate-700">
                                 <div className="w-2 h-2 rounded-full bg-[#1E40AF]"></div> {stat.name}
                              </span>
                              <span className="font-black text-[#1E40AF]">{stat.val}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Recent Activity List (Mini) */}
                  <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                     <div className="flex justify-between items-center mb-4">
                        <div>
                           <h3 className="font-black text-lg text-[#1E40AF] mb-1">Recent Activity</h3>
                           <p className="text-xs text-slate-600 font-semibold">Latest updates</p>
                        </div>
                        <button className="text-slate-400 hover:text-[#1E40AF]"><MoreHorizontal size={18}/></button>
                     </div>
                     <div className="space-y-3">
                        {[
                           { text: 'Jea Bayona updated account', time: '2 min ago', img: 'https://images.unsplash.com/photo-1591123720164-de1348028a82?w=50&h=50&fit=crop' },
                           { text: 'New court added by Admin', time: '1 hour ago', img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=50&h=50&fit=crop' },
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                               <img src={item.img} className="w-10 h-10 rounded-full object-cover border-2 border-[#1E40AF]" />
                               <div className="flex-1">
                                  <p className="text-xs font-bold text-[#1E40AF] line-clamp-1">{item.text}</p>
                                  <p className="text-[10px] font-bold text-slate-500">{item.time}</p>
                               </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

            </div>
        </div>
    );
}

