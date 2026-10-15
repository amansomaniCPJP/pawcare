import React, { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { LoadingSpinner, EmptyState } from '@/components/ui/Skeleton';
import { useToast } from '@/features/notifications/ToastContext';
import { Plus, Check, Calendar as CalendarIcon, List, Trash2, Edit2 } from 'lucide-react';

export default function CarePage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('agenda');
  const [filterType, setFilterType] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  const [form, setForm] = useState({
    title: '',
    petId: '',
    type: 'feeding',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '08:00',
    description: '',
    recurrence: 'daily',
  });

  const loadData = () => {
    Promise.all([userService.getCareTasks(user.id), userService.getMyPets(user.id)]).then(([t, p]) => {
      setTasks(t);
      setPets(p);
      if (p.length > 0 && !form.petId) {
        setForm((prev) => ({ ...prev, petId: p[0].id }));
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.error('Task title is required.');
      return;
    }
    await userService.createTask({
      ...form,
      ownerId: user.id,
      completed: false,
    });
    toast.success('Care task scheduled!');
    setModalOpen(false);
    setForm({
      title: '',
      petId: pets[0]?.id || '',
      type: 'feeding',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '08:00',
      description: '',
      recurrence: 'daily',
    });
    loadData();
  };

  const handleToggleComplete = async (taskId) => {
    const updated = await userService.completeTask(taskId);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    toast.success('Task marked as completed!');
  };

  const handleDeleteTask = async () => {
    if (!deleteTarget) return;
    await userService.deleteTask(deleteTarget.id);
    toast.success('Task removed.');
    setDeleteTarget(null);
    loadData();
  };

  if (loading) return <LoadingSpinner size={40} />;

  const filteredTasks = tasks.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900 }}>Care Management & Calendar</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Schedule and track feeding times, veterinary visits, medications, and grooming routines.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={18} /> Schedule Care Task
        </Button>
      </div>

      {/* View Switcher & Type Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xs)' }}>
        <Tabs
          tabs={[
            { label: 'All Tasks', value: 'all' },
            { label: 'Feeding', value: 'feeding' },
            { label: 'Medication', value: 'medication' },
            { label: 'Exercise', value: 'exercise' },
            { label: 'Grooming', value: 'grooming' },
            { label: 'Vet Visits', value: 'vet' },
          ]}
          activeTab={filterType}
          onChange={setFilterType}
          variant="pills"
        />

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setView('agenda')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              cursor: 'pointer',
              background: view === 'agenda' ? 'var(--color-primary)' : 'var(--color-gray-100)',
              color: view === 'agenda' ? '#fff' : 'var(--color-text-secondary)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
            }}
          >
            <List size={14} /> Agenda
          </button>
          <button
            onClick={() => setView('calendar')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              cursor: 'pointer',
              background: view === 'calendar' ? 'var(--color-primary)' : 'var(--color-gray-100)',
              color: view === 'calendar' ? '#fff' : 'var(--color-text-secondary)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
            }}
          >
            <CalendarIcon size={14} /> Calendar
          </button>
        </div>
      </div>

      {/* AGENDA VIEW */}
      {view === 'agenda' && (
        <div>
          {filteredTasks.length === 0 ? (
            <EmptyState
              icon="🗓️"
              title="No tasks scheduled"
              description="No care tasks match your current filter. Schedule a new task to keep your pet routine organized."
              action={<Button onClick={() => setModalOpen(true)}>Create a Task</Button>}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredTasks.map((task) => {
                const targetPet = pets.find((p) => p.id === task.petId);
                return (
                  <div
                    key={task.id}
                    style={{
                      background: '#fff',
                      borderRadius: 'var(--radius-xl)',
                      padding: '16px 20px',
                      boxShadow: 'var(--shadow-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <button
                        onClick={() => handleToggleComplete(task.id)}
                        disabled={task.completed}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          border: task.completed ? 'none' : '2px solid var(--color-primary)',
                          background: task.completed ? 'var(--color-success)' : '#fff',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: task.completed ? 'default' : 'pointer',
                        }}
                        aria-label="Toggle completed"
                      >
                        {task.completed && <Check size={16} />}
                      </button>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <h3
                            style={{
                              fontSize: 'var(--text-base)',
                              fontWeight: 800,
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: task.completed ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                            }}
                          >
                            {task.title}
                          </h3>
                          {targetPet && (
                            <span style={{ fontSize: '11px', background: 'var(--color-mint)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                              {targetPet.name}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                          Due: <strong>{task.dueDate}</strong> {task.dueTime ? `at ${task.dueTime}` : ''} • Repeat: {task.recurrence}
                        </p>
                        {task.description && (
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>{task.description}</p>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'capitalize', fontWeight: 700, color: 'var(--color-text-muted)', background: 'var(--color-gray-100)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                        {task.type}
                      </span>
                      <button
                        onClick={() => setDeleteTarget(task)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', padding: '6px' }}
                        aria-label="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CALENDAR VIEW */}
      {view === 'calendar' && (
        <div style={{ background: '#fff', borderRadius: 'var(--radius-2xl)', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: '16px' }}>Upcoming Care Schedule</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {['Today', 'Tomorrow', 'This Week', 'Next Week'].map((bucket, i) => (
              <div key={bucket} style={{ background: 'var(--color-gray-50)', padding: '16px', borderRadius: 'var(--radius-xl)', minHeight: '200px' }}>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '12px' }}>
                  {bucket}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredTasks.slice(i * 2, i * 2 + 2).map((t) => (
                    <div key={t.id} style={{ background: '#fff', padding: '10px 12px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xs)' }}>
                      <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>{t.title}</p>
                      <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{t.dueTime || 'Anytime'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Task Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Schedule New Care Task">
        <form onSubmit={handleCreateTask} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Task Title"
            required
            placeholder="e.g. Heartgard Pill, Morning Kibble, Vet Appointment"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select
              label="For Pet"
              value={form.petId}
              onChange={(e) => setForm({ ...form, petId: e.target.value })}
            >
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.species})
                </option>
              ))}
            </Select>

            <Select
              label="Care Category"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="feeding">Feeding</option>
              <option value="medication">Medication</option>
              <option value="exercise">Exercise / Walk</option>
              <option value="grooming">Grooming</option>
              <option value="vet">Veterinary Visit</option>
            </Select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Due Date"
              type="date"
              required
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            <Input
              label="Time"
              type="time"
              value={form.dueTime}
              onChange={(e) => setForm({ ...form, dueTime: e.target.value })}
            />
          </div>

          <Select
            label="Recurrence"
            value={form.recurrence}
            onChange={(e) => setForm({ ...form, recurrence: e.target.value })}
          >
            <option value="none">One-time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Select>

          <Textarea
            label="Notes & Instructions (Optional)"
            placeholder="e.g. Give with food, 1 pill twice daily"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule Task</Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteTask}
        title="Delete Care Task"
        message={`Are you sure you want to remove the task "${deleteTarget?.title}"?`}
        confirmLabel="Delete Task"
      />
    </div>
  );
}
