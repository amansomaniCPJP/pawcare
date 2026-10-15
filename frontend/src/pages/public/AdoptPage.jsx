import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { petService } from '@/services/petService';
import { applicationService } from '@/services/applicationService';
import { useAuth } from '@/features/auth/AuthContext';
import { useToast } from '@/features/notifications/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/Skeleton';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdoptPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [submittedApp, setSubmittedApp] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Applicant Details
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',

    // Step 2: Living & Experience
    livingSituation: 'House with yard',
    ownOrRent: 'Own',
    hasYard: true,
    previousExperience: '',
    otherPets: 'None',
    hoursAvailable: '6-8 hours',
    adoptionReason: '',

    // Step 3: Consent
    consentHomeCheck: false,
    consentCareCommitment: false,
    consentAccurateInfo: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    petService.getById(petId).then((data) => {
      setPet(data);
      setLoading(false);
    }).catch((err) => {
      toast.error(err.message);
      setLoading(false);
    });
  }, [petId]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.address.trim()) errs.address = 'Physical address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.previousExperience.trim()) errs.previousExperience = 'Please describe your pet experience';
    if (!formData.adoptionReason.trim()) errs.adoptionReason = 'Please tell us why you want to adopt';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.consentCareCommitment) errs.consentCareCommitment = 'You must agree to the care commitment';
    if (!formData.consentAccurateInfo) errs.consentAccurateInfo = 'You must certify the information is accurate';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setSubmitting(true);
    try {
      const app = await applicationService.submit({
        petId: pet.id,
        applicantId: user.id,
        petName: pet.name,
        petImage: pet.images?.[0] || '',
        petSpecies: pet.species,
        petBreed: pet.breed,
        answers: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          livingSituation: `${formData.livingSituation} (${formData.ownOrRent})`,
          hasYard: formData.hasYard ? 'Yes' : 'No',
          previousExperience: formData.previousExperience,
          otherPets: formData.otherPets,
          hoursAvailable: formData.hoursAvailable,
          adoptionReason: formData.adoptionReason,
        },
      });
      setSubmittedApp(app);
      toast.success('Adoption application submitted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner size={48} />;

  // Confirmation view if submitted
  if (submittedApp) {
    return (
      <div className="container" style={{ padding: '60px var(--space-6)', maxWidth: '640px', textAlign: 'center' }}>
        <div style={{ background: '#fff', padding: '48px 36px', borderRadius: 'var(--radius-3xl)', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--color-mint)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' }}>
            ✓
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: '12px' }}>
            Application Submitted!
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: '24px' }}>
            Thank you, {formData.fullName}. Your application to adopt <strong>{pet.name}</strong> has been received by <strong>{pet.shelterName || 'the shelter'}</strong>.
          </p>

          <div style={{ background: 'var(--color-cream)', padding: '16px 20px', borderRadius: 'var(--radius-xl)', marginBottom: '32px', textAlign: 'left' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>APPLICATION REFERENCE</p>
            <p style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)' }}>{submittedApp.id}</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Status: <span style={{ fontWeight: 700, color: 'var(--color-warning)' }}>Under Review</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <Link to="/app/applications">
              <Button>Track My Applications</Button>
            </Link>
            <Link to="/pets">
              <Button variant="outline">Browse More Pets</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px var(--space-6) 80px', maxWidth: '800px' }}>
      {/* Header with Pet Card preview */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-2xl)', padding: '24px', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
        <img
          src={pet.images?.[0]}
          alt={pet.name}
          style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-xl)', objectFit: 'cover' }}
        />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            Adoption Application
          </span>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900 }}>Adopt {pet.name}</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            {pet.breed} • {pet.location} • Fee: ${pet.adoptionFee || 100}
          </p>
        </div>
      </div>

      {/* Stepper Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        {[
          { num: 1, label: 'Applicant Info' },
          { num: 2, label: 'Home & Lifestyle' },
          { num: 3, label: 'Review & Submit' },
        ].map((s) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step >= s.num ? 1 : 0.5 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step >= s.num ? 'var(--color-primary)' : 'var(--color-gray-200)',
                color: step >= s.num ? '#fff' : 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
              }}
            >
              {step > s.num ? '✓' : s.num}
            </div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: step >= s.num ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-3xl)', padding: '36px', boxShadow: 'var(--shadow-card)' }}>
        {/* STEP 1: APPLICANT DETAILS */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>Applicant Contact Details</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              Please provide accurate contact details so the shelter staff can follow up regarding your application.
            </p>

            <Input
              label="Full Name"
              required
              value={formData.fullName}
              error={errors.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Email Address"
                type="email"
                required
                value={formData.email}
                error={errors.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              <Input
                label="Phone Number"
                required
                placeholder="(555) 000-0000"
                value={formData.phone}
                error={errors.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <Input
              label="Residential Address"
              required
              placeholder="123 Street Ave, City, State ZIP"
              value={formData.address}
              error={errors.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button onClick={handleNext}>
                Continue to Lifestyle Details <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: HOME & LIFESTYLE */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>Home & Pet Care Arrangements</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              This helps the shelter ensure that {pet.name} is a healthy match for your daily schedule and environment.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Select
                label="Housing Type"
                value={formData.livingSituation}
                onChange={(e) => handleChange('livingSituation', e.target.value)}
              >
                <option value="House with yard">House with fenced yard</option>
                <option value="House no yard">House without yard</option>
                <option value="Apartment / Condo">Apartment / Condo</option>
                <option value="Townhouse">Townhouse</option>
              </Select>

              <Select
                label="Ownership Status"
                value={formData.ownOrRent}
                onChange={(e) => handleChange('ownOrRent', e.target.value)}
              >
                <option value="Own">Own home</option>
                <option value="Rent">Rent (Landlord approval)</option>
              </Select>
            </div>

            <Checkbox
              label="We have a secure outdoor yard or nearby park"
              checked={formData.hasYard}
              onChange={(e) => handleChange('hasYard', e.target.checked)}
            />

            <Select
              label="Time available with the pet per day"
              value={formData.hoursAvailable}
              onChange={(e) => handleChange('hoursAvailable', e.target.value)}
            >
              <option value="4-6 hours">4-6 hours</option>
              <option value="6-8 hours">6-8 hours</option>
              <option value="8+ hours (work from home)">8+ hours (Work from home)</option>
            </Select>

            <Input
              label="Current other pets in the household"
              placeholder="e.g. 1 senior cat, no other dogs"
              value={formData.otherPets}
              onChange={(e) => handleChange('otherPets', e.target.value)}
            />

            <Textarea
              label="Previous pet ownership experience"
              required
              rows={3}
              placeholder="Tell us about pets you have owned before, training experience, etc."
              value={formData.previousExperience}
              error={errors.previousExperience}
              onChange={(e) => handleChange('previousExperience', e.target.value)}
            />

            <Textarea
              label="Why would you like to adopt this pet?"
              required
              rows={3}
              placeholder="What drew you to this pet and what is your plan for their daily care?"
              value={formData.adoptionReason}
              error={errors.adoptionReason}
              onChange={(e) => handleChange('adoptionReason', e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back
              </Button>
              <Button onClick={handleNext}>
                Review & Confirm <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & SUBMIT */}
        {step === 3 && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>Review Your Application</h3>

            <div style={{ background: 'var(--color-cream)', padding: '20px', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700 }}>APPLICANT</span>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                  {formData.fullName} ({formData.email}, {formData.phone})
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{formData.address}</p>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700 }}>LIVING ENVIRONMENT</span>
                <p style={{ fontSize: 'var(--text-sm)' }}>
                  {formData.livingSituation} ({formData.ownOrRent}) • Time daily: {formData.hoursAvailable}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700 }}>PREVIOUS EXPERIENCE</span>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{formData.previousExperience}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--color-gray-100)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Declarations & Consents</h4>

              <Checkbox
                label="I commit to providing humane, lifelong care, veterinary treatment, and nutrition for this pet."
                required
                checked={formData.consentCareCommitment}
                error={errors.consentCareCommitment}
                onChange={(e) => handleChange('consentCareCommitment', e.target.checked)}
              />

              <Checkbox
                label="I certify that all information submitted in this application is accurate and honest."
                required
                checked={formData.consentAccurateInfo}
                error={errors.consentAccurateInfo}
                onChange={(e) => handleChange('consentAccurateInfo', e.target.checked)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft size={16} /> Back
              </Button>
              <Button type="submit" loading={submitting}>
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
