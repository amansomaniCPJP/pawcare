import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { useToast } from '@/features/notifications/ToastContext';
import { Stethoscope, LayoutDashboard, PawPrint, ClipboardList, Users, Building2, BarChart2, Settings, LogOut, Bell, Menu, X } from 'lucide-react';

const NAV = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Pet Management', href: '/admin/pets', icon: PawPrint },
  { label: 'Applications', href: '/admin/applications', icon: ClipboardList },
  { label: 'Adopters', href: '/admin/users', icon: Users },
  { label: 'Shelter Records', href: '/admin/records', icon: Stethoscope },
  { label: 'Reports', href: '/admin/reports', icon: BarChart2 },
];

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out.');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-gray-50)' }}>
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99 }} />}
      <aside
        style={{
          width: 'var(--sidebar-width)',
          background: 'var(--color-text-primary)',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          transition: 'transform 0.25s ease',
        }}
        className={open ? 'admin-open' : 'admin-closed'}
      >
        <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PawPrint size={15} color="#fff" fill="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#fff', fontSize: 'var(--text-lg)' }}>Pawhaven</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Admin Panel
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="admin-close"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
          {NAV.map((item) => {
            const active = item.exact ? location.pathname === item.href : location.pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-lg)',
                  background: active ? 'rgba(57,118,83,0.25)' : 'transparent',
                  color: active ? '#a7d9bb' : 'rgba(255,255,255,0.55)',
                  fontWeight: active ? 700 : 500,
                  fontSize: 'var(--text-sm)',
                  textDecoration: 'none',
                  marginBottom: '2px',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '9px 12px',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.4)',
              background: 'transparent',
            }}
          >
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={user?.avatar || `https://i.pravatar.cc/32?u=${user?.email}`}
            alt={user?.name}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Administrator</p>
          </div>
        </div>
      </aside>
      <div style={{ flex: 1, marginLeft: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column' }} className="admin-main">
        <div
          style={{
            height: 'var(--topbar-height)',
            background: '#fff',
            borderBottom: '1px solid var(--color-gray-100)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: '12px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <button onClick={() => setOpen(true)} className="admin-menu-btn" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <span style={{ flex: 1, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Admin Dashboard
          </span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--color-text-muted)' }} aria-label="Notifications">
            <Bell size={19} />
          </button>
          <img
            src={user?.avatar || `https://i.pravatar.cc/32?u=${user?.email}`}
            alt={user?.name}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>
        <main style={{ flex: 1, padding: '28px 32px', overflowX: 'hidden' }}>{children}</main>
      </div>
      <style>{`
        @media(max-width:900px){
          .admin-closed{transform:translateX(-100%)!important;}
          .admin-open{transform:translateX(0)!important;}
          .admin-main{margin-left:0!important;}
          .admin-menu-btn{display:flex!important;}
          .admin-close{display:flex!important;}
        }
        @media(max-width:640px){ main{padding:16px!important;} }
      `}</style>
    </div>
  );
}
