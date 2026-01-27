
import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
  DashboardTab, 
} from './types';
import { 
  MOCK_USER, 
  MOCK_STATS, 
  MOCK_APPLICATIONS, 
  NAV_ITEMS, 
  ROLE_COLORS 
} from './constants';
import { Card, Badge, Button } from './components/ui/Common';
import ProfileOverview from './components/ProfileOverview';
import RolesManagement from './components/RolesManagement';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import Security from './components/Security';
import Verification from './components/Verification';
import PaymentInfo from './components/PaymentInfo';
import ProfessionalInfo from './components/ProfessionalInfo';
import ProfileCompletion from './components/ProfileCompletion';
import EditProfileModal from './components/Modals/EditProfile';
import { Menu, Star, ExternalLink, Settings as SettingsIcon, Camera, MapPin } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as DashboardTab;
    if (NAV_ITEMS.some(item => item.id === hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    setIsSidebarOpen(false);
  };

  const handleEditSave = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
    setIsEditModalOpen(false);
  };

  const isProfessionalRole = activeRole === UserRole.COACH || activeRole === UserRole.COURT_OWNER;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0056b3] text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-full bg-[#ccff00] flex items-center justify-center p-2 shadow-lg shadow-black/10">
                 <img src="https://img.icons8.com/ios-filled/50/0056b3/tennis-ball.png" className="w-full h-full object-contain" alt="Logo" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter leading-none italic uppercase text-white drop-shadow-sm">PicklePlay</h1>
                <p className="text-[10px] font-bold text-[#ccff00] uppercase tracking-widest mt-0.5">Philippines</p>
              </div>
            </div>

            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as DashboardTab)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-[#ccff00] text-[#0056b3] shadow-xl shadow-black/10' : 'text-blue-100/70 hover:text-white hover:bg-white/10'}`}
                >
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#0056b3]' : 'text-blue-100/50'}`} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-6 bg-black/10 border-t border-white/5">
            <div className="flex items-center gap-4">
              <img src={user.avatarUrl} className="w-10 h-10 rounded-full border-2 border-[#ccff00]" alt="Avatar" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user.fullName}</p>
                <p className="text-[10px] text-blue-100/60 uppercase font-bold tracking-tight">Active Member</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#f4f7fa]">
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 bg-[#0056b3] px-6 py-4 flex lg:hidden items-center justify-between border-b border-blue-400/20 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ccff00] flex items-center justify-center p-1.5">
               <img src="https://img.icons8.com/ios-filled/50/0056b3/tennis-ball.png" className="w-full h-full" alt="Logo" />
            </div>
            <span className="font-black italic uppercase text-sm">PicklePlay</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl bg-white/10 border border-white/20 text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Profile Section */}
        <div className="relative">
          <div className="h-48 md:h-64 w-full bg-[#0056b3] overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              alt="Banner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f4f7fa] to-transparent"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-20 md:-mt-28 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                <div className="relative shrink-0">
                  <div className="p-1 rounded-[2.5rem] bg-white shadow-2xl">
                    <img 
                      src={user.avatarUrl} 
                      alt="Profile" 
                      className="w-32 h-32 md:w-44 md:h-44 rounded-[2.25rem] border-4 border-white object-cover"
                    />
                  </div>
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute bottom-2 right-2 p-2.5 bg-[#ccff00] text-[#0056b3] rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="text-center md:text-left pb-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <h1 className="text-3xl md:text-5xl font-black text-[#0056b3] tracking-tighter uppercase italic">{user.fullName}</h1>
                    <Badge className={`${ROLE_COLORS[activeRole]} text-[10px] font-black px-4 py-1.5 border-2 rounded-xl uppercase tracking-widest`}>
                      {activeRole}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold text-slate-500 mt-2">
                    <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {user.rating} <span className="text-slate-400 font-medium">(45 Reviews)</span></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full hidden md:block"></span>
                    <span className="flex items-center gap-1 uppercase tracking-wide"><MapPin className="w-4 h-4 text-slate-400" /> {user.location.city}, {user.location.country}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center pb-2">
                <Button variant="outline" className="bg-white border-slate-200 text-[#0056b3] font-black uppercase text-xs tracking-widest px-6" onClick={() => setActiveTab('settings')}>
                  Settings
                </Button>
                <Button onClick={() => setIsEditModalOpen(true)} className="bg-[#0056b3] text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 font-black uppercase text-xs tracking-widest px-6">
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10 md:px-10 space-y-8">
          
          <ProfileCompletion user={user} />

          {/* Tab Navigation Menu */}
          <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm overflow-x-auto scrollbar-hide border border-slate-200">
             {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as DashboardTab)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === item.id ? 'bg-[#0056b3] text-white' : 'text-slate-400 hover:text-[#0056b3] hover:bg-blue-50'}`}
                >
                  {item.label}
                </button>
             ))}
          </div>

          {/* Tab Content Area */}
          <div className="min-h-[400px]">
            {activeTab === 'overview' && (
              <>
                <ProfileOverview user={user} onEdit={() => setIsEditModalOpen(true)} />
                {isProfessionalRole && (
                  <div className="mt-8">
                    <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter mb-4">Professional Details</h3>
                    <ProfessionalInfo role={activeRole} />
                  </div>
                )}
              </>
            )}
            {activeTab === 'roles' && (
              <RolesManagement 
                activeRole={activeRole} 
                applications={MOCK_APPLICATIONS} 
                onSwitchRole={() => setActiveRole(activeRole === UserRole.COACH ? UserRole.PLAYER : UserRole.COACH)} 
                onApplyRole={(r) => console.log('apply', r)}
              />
            )}
            {activeTab === 'stats' && <Statistics stats={MOCK_STATS} activeRole={activeRole} />}
            {activeTab === 'financials' && <PaymentInfo />}
            {activeTab === 'settings' && <Settings />}
            {activeTab === 'security' && <Security />}
            {activeTab === 'verification' && <Verification user={user} />}
          </div>
        </div>

        {/* Brand Footer */}
        <footer className="px-6 py-12 md:px-10 bg-[#0056b3] text-white mt-12 overflow-hidden relative">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
             <img src="https://img.icons8.com/ios-filled/500/ffffff/tennis-ball.png" className="w-[600px] h-[600px]" alt="Ball decor" />
          </div>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 justify-between items-center relative z-10">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#ccff00] flex items-center justify-center p-1.5">
                   <img src="https://img.icons8.com/ios-filled/50/0056b3/tennis-ball.png" className="w-full h-full" alt="Logo" />
                </div>
                <h3 className="text-xl font-black italic uppercase italic">PicklePlay Philippines</h3>
              </div>
              <p className="text-blue-100/60 text-xs font-medium">Join the fastest growing sports community in the Visayas.</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="text-[10px] font-black uppercase tracking-widest hover:text-[#ccff00] transition-colors">Privacy Policy</button>
              <button className="text-[10px] font-black uppercase tracking-widest hover:text-[#ccff00] transition-colors">Terms of Service</button>
              <button className="text-[10px] font-black uppercase tracking-widest hover:text-[#ccff00] transition-colors">Contact Support</button>
            </div>
          </div>
        </footer>
      </main>

      <EditProfileModal 
        user={user} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSave={handleEditSave}
      />
    </div>
  );
};

export default App;
