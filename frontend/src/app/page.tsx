"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const features = [
  { icon: '🎓', title: 'University Matching', desc: 'Personalised recommendations based on your GPA, budget, English score and preferred country.' },
  { icon: '💰', title: 'Cost Estimator', desc: 'Full cost breakdown — tuition, living, visa fees, and travel all in one place.' },
  { icon: '🤖', title: 'AI Advisor', desc: 'Chat with our DeepSeek-powered advisor for guidance on admissions, scholarships and visas.' },
  { icon: '🌍', title: 'Multi-Country Data', desc: 'Universities across USA, UK, Canada, Australia, Germany and more.' },
  { icon: '📋', title: 'Visa Guidance', desc: 'Step-by-step visa requirements for each country catered to your situation.' },
  { icon: '⭐', title: 'Admission Insights', desc: 'Know your admission probability before you apply, based on your academic profile.' },
];

const stats = [
  { value: '500+', label: 'Universities' },
  { value: '25+', label: 'Countries' },
  { value: '10k+', label: 'Students Helped' },
  { value: '95%', label: 'Satisfaction' },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="text-center py-16 space-y-6">
        <div className="inline-block bg-purple-50 text-[#7B5CFF] text-xs font-semibold px-4 py-1.5 rounded-full border border-purple-200">
          🚀 AI-Powered Study Abroad Planning
        </div>
        <h1 className="font-['Poppins'] text-5xl font-bold leading-tight text-[#1F2937]">
          Your Smartest Path to<br />
          <span className="gradient-text">Studying Abroad</span>
        </h1>
        <p className="text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
          Discover the right university, estimate your total costs, and get AI-powered guidance — all in one beautiful platform.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {user ? (
            <Link href="/dashboard" className="btn-primary text-base px-8 h-12">View My Dashboard →</Link>
          ) : (
            <>
              <Link href="/register" className="btn-primary text-base px-8 h-12">Get Started Free →</Link>
              <Link href="/login" className="btn-secondary text-base px-8 h-12">Sign In</Link>
            </>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="card text-center">
            <p className="font-['Poppins'] text-3xl font-bold gradient-text">{s.value}</p>
            <p className="text-sm text-[#6B7280] mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="font-['Poppins'] text-3xl font-bold text-[#1F2937]">Everything you need, in one place</h2>
          <p className="text-[#6B7280] mt-2">From discovery to application — we've got you covered.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="card group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">{f.icon}</div>
              <h3 className="text-base font-semibold text-[#1F2937] mb-2">{f.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="rounded-2xl bg-gradient-to-r from-[#7B5CFF] to-[#9D4EDD] p-12 text-center text-white space-y-4">
        <h2 className="font-['Poppins'] text-3xl font-bold">Ready to start your journey?</h2>
        <p className="text-purple-100 text-base">Join thousands of students who used Golearn to find their dream university.</p>
        <Link href="/register" className="inline-flex items-center justify-center h-12 px-8 bg-white text-[#7B5CFF] font-semibold rounded-[10px] hover:bg-purple-50 transition-colors duration-200 shadow-lg mt-2">
          Create Free Account
        </Link>
      </section>
    </div>
  );
}
