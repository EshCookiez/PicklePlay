import React from 'react';
import { UserProfile } from '@/types/profile';
import { 
  Trophy,
  Calendar,
  Activity,
  TrendingUp,
  MapPin,
  Clock,
  Target,
  Zap,
  Award,
  ChevronRight,
  User
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

interface Props {
  user: UserProfile;
  onEdit: () => void;
  isStatusLoading?: boolean;
  activeRole?: string;
}

// Mock data for user stats
const PERFORMANCE_DATA = [
  { name: 'Mon', score: 65, games: 4 },
  { name: 'Tue', score: 75, games: 3 },
  { name: 'Wed', score: 85, games: 5 },
  { name: 'Thu', score: 70, games: 2 },
  { name: 'Fri', score: 90, games: 6 },
  { name: 'Sat', score: 95, games: 8 },
  { name: 'Sun', score: 88, games: 7 },
];

const ProfileOverview: React.FC<Props> = ({ user, onEdit }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      {/* Welcome & Stats Row */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Welcome Card */}
        <div className="flex-1 bg-[#0f2e22] rounded-[2rem] p-8 relative overflow-hidden text-white shadow-xl shadow-green-900/10">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#a3e635] font-bold text-sm uppercase tracking-wider mb-2">Welcome Back</p>
                <h2 className="text-3xl font-extrabold mb-1 tracking-tight">{user.fullName}</h2>
                <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                   <MapPin className="w-4 h-4 text-[#a3e635]" />
                   {user.location.city}, {user.location.country}
                </div>
              </div>
              <button 
                onClick={onEdit}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors backdrop-blur-sm"
              >
                <User className="w-5 h-5 text-[#a3e635]" />
              </button>
            </div>

            <div className="mt-8 flex gap-8">
               <div>
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">PicklePlay Rating</div>
                  <div className="text-3xl font-black text-white flex items-end gap-2">
                    {user.rating} <span className="text-sm font-bold text-[#a3e635] mb-1.5">+0.5</span>
                  </div>
               </div>
               <div>
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">Member Since</div>
                  <div className="text-xl font-bold text-white mt-1.5">
                    {new Date(user.memberSince).getFullYear()}
                  </div>
               </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#a3e635] opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* Quick Stat: Games Played (Green Card Style) */}
        <div className="md:w-1/3 bg-[#a3e635] rounded-[2rem] p-8 relative overflow-hidden group hover:shadow-xl hover:shadow-green-400/20 transition-all duration-300">
           <div className="relative z-10 flex flex-col h-full justify-between">
             <div className="flex justify-between items-start">
               <span className="font-bold text-green-950 text-sm uppercase tracking-wider">Matches</span>
               <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <Trophy className="w-5 h-5 text-green-900" />
               </div>
             </div>
             <div>
               <div className="text-4xl font-extrabold text-green-950 mb-2 tracking-tight">142</div>
               <div className="flex items-center gap-2">
                 <span className="bg-white/80 px-2 py-1 rounded-lg text-xs font-bold text-green-900 flex items-center gap-1 shadow-sm">
                   <TrendingUp className="w-3 h-3" /> +12
                 </span>
                 <span className="text-xs font-bold text-green-900/60">this month</span>
               </div>
             </div>
           </div>
           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Performance Chart */}
         <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-bold text-xl text-slate-900">Performance History</h3>
                <p className="text-slate-500 text-sm font-medium">Weekly activity overview</p>
              </div>
              <select className="bg-slate-50 border-none text-sm font-bold text-slate-600 rounded-xl px-4 py-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                <option>This Week</option>
                <option>Last Week</option>
                <option>Last Month</option>
              </select>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PERFORMANCE_DATA}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  barSize={32}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc', radius: 4 }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="score" name="Performance Score" fill="#0f2e22" radius={[4, 4, 4, 4]} />
                  <Bar dataKey="games" name="Games Played" fill="#a3e635" radius={[4, 4, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Right Column: Stats & Next Match */}
         <div className="space-y-6">
            
            {/* Win Rate Card */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
               <div className="flex justify-between items-center mb-4">
                 <h4 className="font-bold text-slate-500 text-sm uppercase">Win Rate</h4>
                 <Activity className="w-5 h-5 text-[#a3e635]" />
               </div>
               <div className="flex items-end gap-3 mb-2">
                 <div className="text-4xl font-extrabold text-slate-900">68%</div>
                 <div className="text-green-600 font-bold text-sm mb-1.5 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" /> +2.4%
                 </div>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
                  <div className="bg-[#0f2e22] h-full rounded-full w-[68%]"></div>
               </div>
            </div>

            {/* Next Match Card */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
               <div className="flex justify-between items-center mb-6">
                 <h4 className="font-bold text-slate-900 text-lg">Next Match</h4>
                 <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs font-bold">In 2 days</div>
               </div>
               
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400">
                     VS
                  </div>
                  <div>
                     <div className="font-bold text-slate-900">Double Trouble</div>
                     <div className="text-xs font-bold text-slate-400 mt-1">Tournament Semi-Final</div>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                     <Calendar className="w-4 h-4 text-[#a3e635]" />
                     <span>Saturday, 24th July</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                     <Clock className="w-4 h-4 text-[#a3e635]" />
                     <span>10:00 AM - 11:30 AM</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                     <MapPin className="w-4 h-4 text-[#a3e635]" />
                     <span>Greenfield Court 3</span>
                  </div>
               </div>

               <button className="w-full mt-6 py-3 rounded-xl bg-[#0f2e22] text-white font-bold text-sm hover:bg-black transition-colors flex items-center justify-center gap-2">
                  View Details <ChevronRight className="w-4 h-4" />
               </button>
            </div>
         </div>

      </div>

      {/* Recent Achievements Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
         {[
           { title: 'Tournament Winner', desc: 'Summer Open 2025', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50' },
           { title: 'Sharp Shooter', desc: '90% Accuracy last game', icon: Target, color: 'text-red-500', bg: 'bg-red-50' },
           { title: 'MVP', desc: 'Named MVP of Match', icon: Award, color: 'text-purple-500', bg: 'bg-purple-50' },
           { title: 'Fast Learner', desc: 'Rating up +0.2 this week', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
         ].map((achievement, i) => (
           <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-lg transition-shadow cursor-default group">
              <div className={`w-12 h-12 rounded-2xl ${achievement.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                 <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
              </div>
              <div>
                 <h4 className="font-bold text-slate-900 leading-tight">{achievement.title}</h4>
                 <p className="text-xs font-semibold text-slate-400 mt-1">{achievement.desc}</p>
              </div>
           </div>
         ))}
      </div>

    </div>
  );
};

export default ProfileOverview;
