import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { userService } from '@/services/userService';
import { applicationService } from '@/services/applicationService';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import { Heart, Dog, ClipboardList, CheckCircle2, Plus, Calendar, ArrowRight } from 'lucide-react';
import { useToast } from '@/features/notifications/ToastContext';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [favCount, setFavCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    Promise.all([
      userService.getMyPets(user.id),
      userService.getCareTasks(user.id),
      applicationService.getByUser(user.id),
      userService.getFavourites(),
    ]).then(([p, t, a, f]) => {
      setPets(p);
      setTasks(t);
      setApplications(a);
      setFavCount(f.length);
      setLoading(false);
    }).catch((err) => {
      toast.error(err.message);
      setLoading(false);
    });
  }, [user.id]);

  const handleToggleTask = async (taskId) => {
    const updated = await userService.completeTask(taskId);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
  };

  if (loading) return <LoadingSpinner size={40} />;

  const pendingTasks = tasks.filter((t) => !t.completed);
  const activeApps = applications.filter((a) => a.status !== 'withdrawn' && a.status !== 'rejected');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--color-mint) 0%, var(--color-butter) 100%)',
          borderRadius: 'var(--radius-3xl)',
          padding: '32px 36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Pet Parent Portal
          </span>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginTop: '4px', marginBottom: '8px' }}>
            Welcome back, {user?.name.split(' ')[0]}! 🐾
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', maxWidth: '480px' }}>
            You have {pendingTasks.length} pending care tasks scheduled for today and {activeApps.length} active adoption applications.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/app/care">
            <Button size="md">+ New Care Task</Button>
          </Link>
          <Link to="/pets">
            <Button variant="outline" size="md">Browse Pets</Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <StatCard
          label="My Registered Pets"
          value={pets.length}
          icon={Dog}
          color="var(--color-primary)"
          bg="var(--color-mint)"
        />
        <StatCard
          label="Adoption Applications"
          value={applications.length}
          icon={ClipboardList}
          color="#b45309"
          bg="var(--color-butter)"
          subtitle={`${activeApps.length} active review`}
        />
        <StatCard
          label="Saved Favourites"
          value={favCount}
          icon={Heart}
          color="var(--color-coral)"
          bg="#fce8e3"
        />
        <StatCard
          label="Pending Tasks Today"
          value={pendingTasks.length}
          icon={Calendar}
          color="#5b21b6"
          bg="var(--color-lavender)"
        />
      </div>

      {/* Main Grid: Today's Routine + Applications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px', alignItems: 'start' }} className="overview-grid">
        {/* Left: Care Tasks */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-2xl)', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Today's Care Tasks</h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Daily routine checklist for your companions</p>
            </div>
            <Link to="/app/care" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 700 }}>
              View calendar →
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-text-muted)' }}>
              No tasks scheduled for today.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-lg)',
                    background: task.completed ? 'var(--color-gray-50)' : '#fff',
                    border: `1.5px solid ${task.completed ? 'var(--color-gray-200)' : 'var(--color-mint-dark)'}`,
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      disabled={task.completed}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        border: task.completed ? 'none' : '2px solid var(--color-primary)',
                        background: task.completed ? 'var(--color-success)' : '#fff',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        cursor: task.completed ? 'default' : 'pointer',
                      }}
                      aria-label="Complete task"
                    >
                      {task.completed && '✓'}
                    </button>
                    <div>
                      <p
                        style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 700,
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                        }}
                      >
                        {task.title}
                      </p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        {task.dueTime ? `${task.dueTime} • ` : ''}
                        {task.description}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      background: 'var(--color-gray-100)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {task.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Applications Activity */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-2xl)', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Recent Applications</h2>
            <Link to="/app/applications" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 700 }}>
              All applications →
            </Link>
          </div>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-text-muted)' }}>
              No applications submitted yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {applications.map((app) => (
                <div
                  key={app.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-gray-100)',
                  }}
                >
                  <img
                    src={app.petImage}
                    alt={app.petName}
                    style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {app.petName}
                      </p>
                      <StatusBadge status={app.status} />
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Submitted {new Date(app.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .overview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
