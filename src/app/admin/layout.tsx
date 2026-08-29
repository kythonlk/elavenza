'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Users, 
  LogOut, 
  ArrowLeft, 
  Menu, 
  X,
  Droplet
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Layers },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('elavenza-user');
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      const parsed = JSON.parse(user);
      if (parsed.role !== 'admin') {
        router.push('/');
        return;
      }
      setAuthorized(true);
    } catch {
      router.push('/auth/login');
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <p className="text-text-muted text-sm font-medium">Verifying admin credentials...</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('elavenza-token');
    localStorage.removeItem('elavenza-user');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-bg-alt flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 bg-secondary flex-col fixed h-screen z-30 shadow-xl">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <Droplet className="w-5 h-5 text-white" />
          </div>
          <div>
            <Link href="/admin" className="text-white text-xl font-heading font-bold block">Elavenza</Link>
            <span className="text-white/50 text-[10px] uppercase tracking-widest font-semibold block">Store Management</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link 
            href="/" 
            className="flex items-center gap-2.5 text-white/70 text-sm hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </Link>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-2.5 text-left px-4 py-2 text-error/90 text-sm hover:text-error hover:bg-white/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-secondary z-30 flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="text-white p-1.5 rounded-lg hover:bg-white/10"
          aria-label="Open sidebar"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="text-white font-heading font-bold text-lg">Elavenza Admin</span>
        <button onClick={handleLogout} className="text-white/70 text-xs hover:text-white">
          Logout
        </button>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/60 z-40" 
            onClick={() => setSidebarOpen(false)} 
          />
          <aside className="lg:hidden fixed left-0 top-0 h-full w-64 bg-secondary z-50 animate-slide-in-right p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <Droplet className="w-5 h-5 text-accent" />
                <span className="text-white text-xl font-heading font-bold">Elavenza Admin</span>
              </div>
              <nav className="space-y-1.5">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? 'bg-primary text-white' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div>
              <Link 
                href="/" 
                className="flex items-center gap-2 text-white/70 text-sm hover:text-white py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Store</span>
              </Link>
            </div>
          </aside>
        </>
      )}

      {/* Main Admin View */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
