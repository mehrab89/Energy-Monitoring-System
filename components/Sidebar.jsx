'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, Zap, Settings, LayoutDashboard, LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Don't show sidebar on login/register pages
  if (pathname === '/login' || pathname === '/register') return null;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Usage History', icon: History, path: '/history' },
    { name: 'Appliances', icon: Zap, path: '/appliances' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 h-screen glass-card rounded-none border-y-0 border-l-0 border-r border-[rgba(255,255,255,0.05)] flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <Zap size={24} className="text-white fill-current" />
        </div>
        <h1 className="text-xl font-bold tracking-tight glow-text bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
          EnergySense
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'sidebar-active text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-indigo-400'} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        {session?.user && (
          <div className="p-4 glass-card bg-indigo-500/10 border-indigo-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                {session.user.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{session.user.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{session.user.email}</p>
              </div>
            </div>
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-sm font-bold"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}

        <div className="p-4 glass-card bg-indigo-500/10 border-indigo-500/20 rounded-2xl">
          <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
            <span className="text-sm text-slate-200 font-medium">Monitoring Live</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
