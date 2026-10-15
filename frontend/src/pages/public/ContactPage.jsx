import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useToast } from '@/features/notifications/ToastContext';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please complete all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Your message has been sent!');
    }, 600);
  };

  return (
    <div className="container" style={{ padding: '60px var(--space-6) 100px' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
        <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, marginBottom: '12px' }}>
          Contact Pawhaven Support
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' }}>
          Have questions regarding adoption applications, platform care tools, or shelter partnership? Get in touch with our team.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', alignItems: 'start' }} className="contact-layout">
        {/* Contact Info column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: '#fff', padding: '28px', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-card)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: '16px' }}>Direct Inquiries</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={18} color="var(--color-primary)" />
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>EMAIL</p>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>support@pawhaven.demo</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: 'var(--color-butter)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={18} color="#b45309" />
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>PHONE</p>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>(555) 839-7297 (Demo)</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: 'var(--color-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} color="#5b21b6" />
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>HEADQUARTERS</p>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>Austin, Texas • Demonstration App</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--color-cream-dark)', padding: '24px', borderRadius: 'var(--radius-2xl)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: '8px' }}>Are you an animal shelter?</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              We offer free onboarding for verified rescue shelters. Contact our shelter coordinator to list pets and manage applications.
            </p>
          </div>
        </div>

        {/* Form column */}
        <div style={{ background: '#fff', padding: '36px', borderRadius: 'var(--radius-3xl)', boxShadow: 'var(--shadow-card)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-mint)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>
                ✓
              </div>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, marginBottom: '8px' }}>Message Received</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '24px' }}>
                Thank you, {form.name}. We have logged your demonstration inquiry and will reply shortly.
              </p>
              <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>Send Us a Message</h2>

              <Input
                label="Your Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <Input
                label="Email Address"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <Input
                label="Subject"
                placeholder="e.g. Adoption question, shelter signup, general feedback"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />

              <Textarea
                label="Your Message"
                required
                rows={5}
                placeholder="How can we assist you?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <Button type="submit" loading={loading} style={{ alignSelf: 'flex-start' }}>
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .contact-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
