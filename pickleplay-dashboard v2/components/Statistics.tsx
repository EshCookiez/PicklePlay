import React from 'react';
import { UserStatistics, UserRole } from '../types';
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* High Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Bookings</p>
            <p className="text-2xl font-bold text-slate-900">{stats.bookings.total}</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Avg Rating</p>
            <p className="text-2xl font-bold text-slate-900">{stats.reviews.average} <span className="text-sm font-normal text-slate-400">/ 5</span></p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Completion</p>
            <p className="text-2xl font-bold text-slate-900">{stats.bookings.completionRate}%</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Spent/Earned</p>
            <p className="text-2xl font-bold text-slate-900">$2.4k</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Monthly Activity
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="bookings" stroke="#10b981" fillOpacity={1} fill="url(#colorBookings)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Reviews Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Reviews Breakdown
          </h3>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.reviews.breakdown[rating as keyof typeof stats.reviews.breakdown];
              const percentage = (count / stats.reviews.total) * 100;
              return (
                <div key={rating} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-600 w-4">{rating}★</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-400 w-8">{count}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.reviews.total}</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Reviews</p>
            </div>
            <button className="text-sm font-bold text-emerald-600 hover:underline">View all reviews</button>
          </div>
        </Card>
      </div>

      {/* Role-Specific Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeRole === UserRole.COACH && stats.coachStats && (
          <>
            <Card className="p-5 border-l-4 border-l-emerald-500">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Active Students</p>
              <p className="text-2xl font-bold text-slate-900">{stats.coachStats.activeStudents}</p>
              <div className="mt-2 flex items-center gap-1 text-emerald-600 text-xs font-bold">
                <TrendingUp className="w-3 h-3" /> +2 this month
              </div>
            </Card>
            <Card className="p-5 border-l-4 border-l-emerald-500">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Earnings</p>
              <p className="text-2xl font-bold text-slate-900">${stats.coachStats.totalEarnings}</p>
              <p className="mt-2 text-slate-400 text-xs">Total payout balance</p>
            </Card>
            <Card className="p-5 border-l-4 border-l-emerald-500">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Lessons Given</p>
              <p className="text-2xl font-bold text-slate-900">{stats.coachStats.lessonsGiven}</p>
              <p className="mt-2 text-slate-400 text-xs">Since joining the platform</p>
            </Card>
          </>
        )}
        {activeRole === UserRole.PLAYER && stats.playerStats && (
          <>
            <Card className="p-5 border-l-4 border-l-blue-500">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Global Ranking</p>
              <p className="text-2xl font-bold text-slate-900">{stats.playerStats.ranking || 'Unranked'}</p>
              <div className="mt-2 flex items-center gap-1 text-blue-600 text-xs font-bold uppercase">
                Top 5% regionally
              </div>
            </Card>
            <Card className="p-5 border-l-4 border-l-blue-500">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Tournament Wins</p>
              <p className="text-2xl font-bold text-slate-900">{stats.playerStats.tournamentWins}</p>
              <div className="mt-2 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span className="text-slate-400 text-xs">Recent: Austin Open</span>
              </div>
            </Card>
            <Card className="p-5 border-l-4 border-l-blue-500">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Matches Played</p>
              <p className="text-2xl font-bold text-slate-900">{stats.playerStats.matchesPlayed}</p>
              <p className="mt-2 text-slate-400 text-xs">85% win rate</p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Statistics;
