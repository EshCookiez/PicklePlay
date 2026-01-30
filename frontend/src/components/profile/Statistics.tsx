import React from 'react';
import { UserStatistics, UserRole } from '@/types/profile';
import { Card } from './ui/Common';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
// Combined all lucide-react icons into a single import statement to fix duplicate identifier errors
import { Star, TrendingUp, Users, Calendar, DollarSign, Target, Activity, Trophy } from 'lucide-react';

interface Props {
  stats: UserStatistics;
  activeRole: UserRole;
}

const MOCK_CHART_DATA = [
  { name: 'Jan', bookings: 12, revenue: 400 },
  { name: 'Feb', bookings: 19, revenue: 650 },
  { name: 'Mar', bookings: 15, revenue: 500 },
  { name: 'Apr', bookings: 22, revenue: 900 },
  { name: 'May', bookings: 30, revenue: 1200 },
  { name: 'Jun', bookings: 26, revenue: 1100 },
];

const Statistics: React.FC<Props> = ({ stats, activeRole }) => {
  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* High Level Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#0f2e22] text-[#a3e635] flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase truncate">Bookings</p>
            <p className="text-lg sm:text-2xl font-black text-slate-900">{stats.bookings.total}</p>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FDE047] text-[#0f2e22] flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase truncate">Rating</p>
            <p className="text-lg sm:text-2xl font-black text-slate-900">{stats.reviews.average}<span className="text-sm font-normal text-slate-400">/5</span></p>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#a3e635] text-[#0f2e22] flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase truncate">Completion</p>
            <p className="text-lg sm:text-2xl font-black text-slate-900">{stats.bookings.completionRate}%</p>
          </div>
        </Card>
        <Card className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#0f2e22]/10 text-[#0f2e22] flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase truncate">Spent/Earned</p>
            <p className="text-lg sm:text-2xl font-black text-slate-900">₱2.4k</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Activity Chart */}
        <Card className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3e635]" />
            Monthly Activity
          </h3>
          <div className="h-[160px] sm:h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a3e635" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a3e635" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                />
                <Area type="monotone" dataKey="bookings" stroke="#0f2e22" fillOpacity={1} fill="url(#colorBookings)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Reviews Breakdown */}
        <Card className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#FDE047]" />
            Reviews Breakdown
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.reviews.breakdown[rating as keyof typeof stats.reviews.breakdown];
              const percentage = (count / stats.reviews.total) * 100;
              return (
                <div key={rating} className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-bold text-[#0f2e22] w-8">{rating}★</span>
                  <div className="flex-1 h-2 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FDE047] to-[#a3e635] rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-500 font-bold w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.reviews.total}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Reviews</p>
            </div>
            <button className="text-xs sm:text-sm font-bold text-[#0f2e22] hover:text-[#a3e635] transition-colors">View all →</button>
          </div>
        </Card>
      </div>

      {/* Role-Specific Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {activeRole === UserRole.COACH && stats.coachStats && (
          <>
            <Card className="p-4 sm:p-6 border-l-4 border-l-[#a3e635] bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Active Students</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.coachStats.activeStudents}</p>
              <div className="mt-2 flex items-center gap-1 text-[#0f2e22] text-xs sm:text-sm font-bold bg-[#a3e635]/10 rounded-lg px-2 py-1 w-fit">
                <TrendingUp className="w-3 h-3" /> +2 this month
              </div>
            </Card>
            <Card className="p-4 sm:p-6 border-l-4 border-l-[#FDE047] bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Earnings</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">₱{stats.coachStats.totalEarnings}</p>
              <p className="mt-2 text-slate-400 text-xs sm:text-sm">Total payout balance</p>
            </Card>
            <Card className="p-4 sm:p-6 border-l-4 border-l-[#0f2e22] bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Lessons Given</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.coachStats.lessonsGiven}</p>
              <p className="mt-2 text-slate-400 text-xs sm:text-sm">Since joining</p>
            </Card>
          </>
        )}
        {activeRole === UserRole.PLAYER && stats.playerStats && (
          <>
            <Card className="p-4 sm:p-6 border-l-4 border-l-[#a3e635] bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Global Ranking</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.playerStats.ranking || 'Unranked'}</p>
              <div className="mt-2 flex items-center gap-1 text-[#0f2e22] text-xs font-bold uppercase bg-[#a3e635]/10 rounded-lg px-2 py-1 w-fit">
                Top 5% regionally
              </div>
            </Card>
            <Card className="p-4 sm:p-6 border-l-4 border-l-[#FDE047] bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Tournament Wins</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.playerStats.tournamentWins}</p>
              <div className="mt-2 flex items-center gap-1">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-[#FDE047]" />
                <span className="text-slate-400 text-xs sm:text-sm">Recent: Austin Open</span>
              </div>
            </Card>
            <Card className="p-4 sm:p-6 border-l-4 border-l-[#0f2e22] bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Matches Played</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.playerStats.matchesPlayed}</p>
              <p className="mt-2 text-slate-400 text-xs sm:text-sm">85% win rate</p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Statistics;
