"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL || '';

type Rec = { program: string; university: string; country: string; annualTuition: number; matchScore: number };

const countryFlag: Record<string, string> = {
  'United States': '🇺🇸', 'United Kingdom': '🇬🇧', 'Canada': '🇨🇦',
  'Australia': '🇦🇺', 'Germany': '🇩🇪', 'France': '🇫🇷',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [recs, setRecs] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API}/api/recommendations/${user.id}`);
        if (res.ok) setRecs(await res.json());
      } catch {}
      finally { setLoading(false); }
    };
    fetch_();
  }, [user]);

  const getBadgeColor = (score: number) => {
    if (score >= 90) return 'badge-green';
    if (score >= 75) return 'badge-blue';
    return 'badge-purple';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Poppins'] text-3xl font-bold text-[#1F2937]">
            {user ? `Hey ${user.name?.split(' ')[0] || 'there'} 👋` : 'University Dashboard'}
          </h1>
          <p className="text-[#6B7280] mt-1">Your personalised university recommendations</p>
        </div>
        <Link href="/profile" className="btn-secondary text-sm">Update Profile</Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : recs.length === 0 ? (
        <div className="card text-center py-16 space-y-4">
          <p className="text-5xl">🎓</p>
          <h2 className="text-xl font-semibold text-[#1F2937]">No recommendations yet</h2>
          <p className="text-[#6B7280]">Fill out your profile so we can match you with the best universities.</p>
          <Link href="/profile" className="btn-primary inline-flex">Set Up Profile →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recs.map((rec, i) => (
            <div key={i} className="card flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">
                    {countryFlag[rec.country] || '🌍'} {rec.country}
                  </p>
                  <h2 className="font-semibold text-[#1F2937] leading-snug">{rec.university}</h2>
                </div>
                <span className={getBadgeColor(Math.round(rec.matchScore))}>
                  {Math.round(rec.matchScore)}%
                </span>
              </div>

              <div className="border-t border-[#E6E8F0] pt-3 space-y-2">
                <p className="text-sm text-[#6B7280]">
                  <span className="font-medium text-[#7B5CFF]">{rec.program}</span>
                </p>
                <p className="text-sm text-[#6B7280]">
                  💰 <span className="font-medium text-[#1F2937]">${rec.annualTuition.toLocaleString()}</span>/year tuition
                </p>
                <div className="mt-1">
                  <div className="text-xs text-[#9CA3AF] mb-1">Match score</div>
                  <div className="h-2 bg-[#F7F8FC] rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#7B5CFF] to-[#9D4EDD] transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, rec.matchScore))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Advisor CTA */}
      {!loading && recs.length > 0 && (
        <div className="card bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[#1F2937]">Want personalised advice?</p>
            <p className="text-sm text-[#6B7280]">Ask our AI advisor about admissions, scholarships or visas.</p>
          </div>
          <Link href="/chat" className="btn-primary shrink-0">Chat with AI →</Link>
        </div>
      )}
    </div>
  );
}
