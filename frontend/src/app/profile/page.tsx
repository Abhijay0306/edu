"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Netherlands', 'Singapore', 'Japan', 'New Zealand'];
const PROGRAMS = ['Undergraduate', 'Masters', 'PhD', 'Diploma', 'MBA'];
const COURSE_FIELDS = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business & Management', 'Data Science & AI', 'Natural Sciences', 'Medicine & Health', 'Law', 'Architecture', 'Arts & Humanities', 'Economics', 'Robotics & Automation', 'Life Sciences', 'Other'];
const COURSE_TYPES = ['Full-time', 'Part-time', 'Online', 'Hybrid'];
const INTAKE_YEARS = [2025, 2026, 2027, 2028];

function SliderInput({ label, min, max, step, value, onChange, unit = '' }: {
  label: string; min: number; max: number; step: number;
  value: string; onChange: (v: string) => void; unit?: string;
}) {
  const numVal = parseFloat(value) || min;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="label mb-0">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="number" min={min} max={max} step={step}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-20 text-right h-9 px-2 rounded-lg border border-[#E6E8F0] text-sm font-semibold text-[#7B5CFF] focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]"
          />
          {unit && <span className="text-sm text-[#6B7280]">{unit}</span>}
        </div>
      </div>
      <div className="relative mt-1">
        <input
          type="range" min={min} max={max} step={step}
          value={numVal}
          onChange={e => onChange(e.target.value)}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #7B5CFF ${((numVal - min) / (max - min)) * 100}%, #E6E8F0 ${((numVal - min) / (max - min)) * 100}%)`
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    gpa: '3.5', preferredCountry: '', preferredProgram: '',
    courseField: '', courseType: '', intakeYear: '',
    englishScore: '6.5', budget: '40000',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    const loadProfile = async () => {
      const res = await fetch(`${API}/api/profiles/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          gpa: data.gpa ?? '3.5',
          preferredCountry: data.preferredCountry ?? '',
          preferredProgram: data.preferredProgram ?? '',
          courseField: data.courseField ?? '',
          courseType: data.courseType ?? '',
          intakeYear: data.intakeYear?.toString() ?? '',
          englishScore: data.englishScore ?? '6.5',
          budget: data.budget ?? '40000',
        });
      }
    };
    loadProfile();
  }, [user, router]);

  const set = (key: string) => (val: string) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true); setError(''); setSaved(false);
    try {
      const res = await fetch(`${API}/api/profiles/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          gpa: parseFloat(formData.gpa),
          preferredCountry: formData.preferredCountry || null,
          preferredProgram: formData.preferredProgram || null,
          courseField: formData.courseField || null,
          courseType: formData.courseType || null,
          intakeYear: formData.intakeYear ? parseInt(formData.intakeYear) : null,
          englishScore: parseFloat(formData.englishScore),
          budget: parseFloat(formData.budget),
        }),
      });
      if (!res.ok) { setError('Failed to save profile'); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ChipGroup = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o} type="button" onClick={() => onChange(value === o ? '' : o)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
            value === o ? 'bg-gradient-to-r from-[#7B5CFF] to-[#9D4EDD] text-white border-transparent shadow-sm'
              : 'bg-white text-[#6B7280] border-[#E6E8F0] hover:border-[#7B5CFF] hover:text-[#7B5CFF]'}`}>
          {o}
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-['Poppins'] text-3xl font-bold text-[#1F2937]">Your Study Profile</h1>
        <p className="text-[#6B7280] mt-1">Personalise your university recommendations — the more you fill in, the better the matches.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-7">

          {/* GPA Slider */}
          <SliderInput label="CGPA / GPA" min={0} max={4.0} step={0.1} value={formData.gpa} onChange={set('gpa')} unit="/4.0" />

          {/* IELTS Slider */}
          <SliderInput label="English Score (IELTS equivalent)" min={4.0} max={9.0} step={0.5} value={formData.englishScore} onChange={set('englishScore')} unit=" IELTS" />

          {/* Budget Slider */}
          <SliderInput label="Annual Budget (USD)" min={5000} max={100000} step={1000} value={formData.budget} onChange={set('budget')} unit=" USD" />

          <hr style={{ borderColor: '#E6E8F0' }} />

          {/* Preferred Country */}
          <div>
            <label className="label">Preferred Country</label>
            <div className="relative">
              <select className="select-input" value={formData.preferredCountry} onChange={e => set('preferredCountry')(e.target.value)}>
                <option value="">Any country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          {/* Program Level */}
          <div>
            <label className="label">Program Level</label>
            <ChipGroup options={PROGRAMS} value={formData.preferredProgram} onChange={set('preferredProgram')} />
          </div>

          {/* Course Field */}
          <div>
            <label className="label">Field of Study</label>
            <div className="relative">
              <select className="select-input" value={formData.courseField} onChange={e => set('courseField')(e.target.value)}>
                <option value="">Select a field...</option>
                {COURSE_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          {/* Course Type */}
          <div>
            <label className="label">Course Type</label>
            <ChipGroup options={COURSE_TYPES} value={formData.courseType} onChange={set('courseType')} />
          </div>

          {/* Intake Year */}
          <div>
            <label className="label">Target Intake Year</label>
            <ChipGroup options={INTAKE_YEARS.map(String)} value={formData.intakeYear} onChange={set('intakeYear')} />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          {saved && <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg flex items-center gap-2">✅ Profile saved! <a href="/dashboard" className="font-semibold underline">View recommendations →</a></p>}

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
