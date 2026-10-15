import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { useToast } from '@/features/notifications/ToastContext';
import { LayoutDashboard, PawPrint, Heart, ClipboardList, Calendar, Settings, Search, LogOut, Bell, Menu, X, Dog } from 'lucide-react';

const NAV = [
  { label: 'Overview', href: '/app', icon: LayoutDashboard, exact: true },
  { label: 'Discover Pets', href: '/pets', icon: Search },
  { label: 'My Applications', href: '/app/applications', icon: ClipboardList },
  { label: 'Favourites', href: '/app/favourites', icon: Heart },
  { label: 'My Pets', href: '/app/pets', icon: Dog },
  { label: 'Care Calendar', href: '/app/care', icon: Calendar },
  { label: 'Settings', href: '/app/settings', icon: Settings },
];

export default function UserDashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success('You have been signed out.');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-gray-50)' }}>
      {/* Overlay */}
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 99 }} />}

      {/* Sidebar */}
      <aside
        style={{
          width: 'var(--sidebar-width)',
          background: '#fff',
          borderRight: '1px solid var(--color-gray-100)',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          transition: 'transform 0.25s ease',
        }}
        className={open ? 'sidebar-open' : 'sidebar-closed'}
      >
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--color-gray-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
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
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: 'var(--text-lg)',
                color: 'var(--color-primary)',
              }}
            >
              Pawhaven
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
            className="close-btn"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '8px 12px 6px',
            }}
          >
            My Space
          </p>
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
                  background: active ? 'var(--color-mint)' : 'transparent',
                  color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  fontWeight: active ? 700 : 500,
                  fontSize: 'var(--text-sm)',
                  textDecoration: 'none',
                  marginBottom: '2px',
                  transition: 'background var(--transition-fast)',
                }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '12px', borderTop: '1px solid var(--color-gray-100)' }}>
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
              color: 'var(--color-error)',
              background: 'transparent',
            }}
          >
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>

        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--color-gray-100)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <img
            src={user?.avatar || `https://i.pravatar.cc/40?u=${user?.email}`}
            alt={user?.name}
            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </p>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.email}
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          marginLeft: 'var(--sidebar-width)',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
        className="main-content"
      >
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
          <button
            onClick={() => setOpen(true)}
            className="menu-btn"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span style={{ flex: 1 }} />
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--color-text-muted)',
              position: 'relative',
            }}
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--color-coral)',
                border: '1.5px solid #fff',
              }}
            />
          </button>
          <Link to="/app/settings">
            <img
              src={user?.avatar || `https://i.pravatar.cc/36?u=${user?.email}`}
              alt={user?.name}
              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', display: 'block' }}
            />
          </Link>
        </div>
        <main style={{ flex: 1, padding: '28px 32px', overflowX: 'hidden' }}>{children}</main>
      </div>

      <style>{`
        @media(max-width:900px){
          .sidebar-closed{transform:translateX(-100%)!important;}
          .sidebar-open{transform:translateX(0)!important;}
          .main-content{margin-left:0!important;}
          .menu-btn{display:flex!important;}
          .close-btn{display:flex!important;}
        }
        @media(max-width:640px){
          main{padding:16px!important;}
        }
      `}</style>
    </div>
  );
}
