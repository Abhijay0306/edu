"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (isAuthPage) return null;

  const navLinks = [
    { href: '/dashboard', label: 'Universities' },
    { href: '/profile', label: 'My Profile' },
    { href: '/chat', label: 'AI Advisor' },
    ...(user?.role === 'SUPER_ADMIN' ? [{ href: '/admin', label: '⚙ Admin' }] : []),
  ];

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E6E8F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-['Poppins'] font-bold gradient-text">Golearn</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}
              className={pathname === l.href ? 'nav-link-active' : 'nav-link'}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/settings" className="text-sm text-[#6B7280] hidden md:block hover:text-[#7B5CFF] transition-colors">
                👋 {user.name?.split(' ')[0] || user.email.split('@')[0]}
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-xs px-4 h-9">Log Out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">Login</Link>
              <Link href="/register" className="btn-primary text-sm px-5 h-9">Join for Free</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
