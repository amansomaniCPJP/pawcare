import React, { useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input, Checkbox } from '@/components/ui/Input';
import { useToast } from '@/features/notifications/ToastContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    taskReminders: true,
    statusUpdates: true,
  });

  const [saving, setSaving] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile details updated!');
    }, 500);
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    toast.success('Notification preferences updated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '720px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900 }}>Profile & Account Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Manage your personal information, contact methods, and alert preferences.
        </p>
      </div>

      {/* Profile Form */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-2xl)', padding: '32px', boxShadow: 'var(--shadow-card)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '20px' }}>Personal Information</h2>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Input
            label="Full Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Email Address"
              type="email"
              value={profile.email}
              disabled
              hint="Email address cannot be changed directly in demo"
            />
            <Input
              label="Phone Number"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>

          <Input
            label="Home Address"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          />

          <div style={{ marginTop: '10px' }}>
            <Button type="submit" loading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Notifications Preferences */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-2xl)', padding: '32px', boxShadow: 'var(--shadow-card)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '20px' }}>Notification Preferences</h2>

        <form onSubmit={handleSaveNotifications} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Checkbox
            label="Application status update emails (under review, approvals)"
            checked={notifications.statusUpdates}
            onChange={(e) => setNotifications({ ...notifications, statusUpdates: e.target.checked })}
          />

          <Checkbox
            label="Daily pet care task reminders (feeding, walk, medications)"
            checked={notifications.taskReminders}
            onChange={(e) => setNotifications({ ...notifications, taskReminders: e.target.checked })}
          />

          <Checkbox
            label="Shelter alerts and newly available pets in your area"
            checked={notifications.emailAlerts}
            onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
          />

          <div style={{ marginTop: '10px' }}>
            <Button type="submit" variant="secondary">
              Update Notifications
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
