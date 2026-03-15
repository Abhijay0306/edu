"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || '';

type University = { 
  id: string; 
  name: string; 
  country: { id: string; name: string }; 
  ranking: number | null; 
  programs: any[]; 
  description: string; 
  website: string 
};
type User = { id: string; email: string; name: string | null; role: string; createdAt: string };
type Stats = { users: number; universities: number; programs: number; recommendations: number };
type Country = { id: string; name: string };

const tabs = ['Overview', 'Universities', 'Users'] as const;
type Tab = typeof tabs[number];

export default function AdminPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('Overview');
  const [unis, setUnis] = useState<University[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', website: '', ranking: '' });
  
  const [showAddUni, setShowAddUni] = useState(false);
  const [addUniForm, setAddUniForm] = useState({ name: '', description: '', website: '', ranking: '', countryId: '' });
  
  const [msg, setMsg] = useState('');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'SUPER_ADMIN') { router.push('/'); return; }
  }, [user, router]);

  useEffect(() => {
    if (!token || !user || user.role !== 'SUPER_ADMIN') return;
    const load = async () => {
      setLoading(true);
      setMsg('');
      try {
        console.log("Fetching admin data...");
        const resStats = await fetch(`${API}/api/admin/stats`, { headers });
        if (resStats.ok) setStats(await resStats.json());
        else console.error("Stats fetch failed", resStats.status);

        const resUnis = await fetch(`${API}/api/admin/universities`, { headers });
        if (resUnis.ok) setUnis(await resUnis.json());
        else console.error("Unis fetch failed", resUnis.status);

        const resUsers = await fetch(`${API}/api/admin/users`, { headers });
        if (resUsers.ok) setUsers(await resUsers.json());
        else console.error("Users fetch failed", resUsers.status);

        const resSearch = await fetch(`${API}/api/universities/search`, { headers });
        if (resSearch.ok) {
          const data = await resSearch.json();
          const unique = Array.from(new Set(data.map((u: any) => JSON.stringify(u.country)))).map((s: any) => JSON.parse(s));
          setCountries(unique as Country[]);
        }
      } catch (err: any) {
        console.error("Dashboard load error:", err);
        setMsg(`Error loading dashboard: ${err.message}`);
      }
      setLoading(false);
    };
    load();
  }, [token, user]);

  const deleteUni = async (id: string) => {
    if (!confirm('Delete this university and all its programs?')) return;
    await fetch(`${API}/api/admin/universities/${id}`, { method: 'DELETE', headers });
    setUnis(prev => prev.filter(u => u.id !== id));
    setMsg('University deleted.');
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user and all their data?')) return;
    await fetch(`${API}/api/admin/users/${id}`, { method: 'DELETE', headers });
    setUsers(prev => prev.filter(u => u.id !== id));
    setMsg('User deleted.');
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'ADMIN' ? 'STUDENT' : 'ADMIN';
    const res = await fetch(`${API}/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ role: nextRole }),
    });
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: nextRole } : u));
      setMsg(`User role updated to ${nextRole}.`);
    }
  };

  const saveEdit = async () => {
    if (!editId) return;
    const res = await fetch(`${API}/api/admin/universities/${editId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ ...editForm, ranking: editForm.ranking ? parseInt(editForm.ranking) : null }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUnis(prev => prev.map(u => u.id === editId ? { ...u, ...updated } : u));
      setEditId(null);
      setMsg('University updated.');
    }
  };

  const addUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUniForm.countryId) { setMsg('Please select a country.'); return; }
    const res = await fetch(`${API}/api/admin/universities`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        ...addUniForm, 
        ranking: addUniForm.ranking ? parseInt(addUniForm.ranking) : null 
      }),
    });
    if (res.ok) {
      const newUni = await res.json();
      setUnis(prev => [newUni, ...prev]);
      setShowAddUni(false);
      setAddUniForm({ name: '', description: '', website: '', ranking: '', countryId: '' });
      setMsg('University added successfully!');
    }
  };

  if (!user || user.role !== 'SUPER_ADMIN') return null;

  const statCards = [
    { label: 'Total Users', value: stats?.users ?? '—', icon: '👤' },
    { label: 'Universities', value: stats?.universities ?? '—', icon: '🏛️' },
    { label: 'Programs', value: stats?.programs ?? '—', icon: '📚' },
    { label: 'Recommendations', value: stats?.recommendations ?? '—', icon: '⭐' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Poppins'] text-3xl font-bold text-[#1F2937]">Super Admin Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge badge-green">SUPER_ADMIN</span>
            <span className="text-sm text-[#6B7280]">{user.email}</span>
          </div>
        </div>
        {tab === 'Universities' && (
          <button onClick={() => setShowAddUni(!showAddUni)} className="btn-primary text-sm px-4 h-9">
            {showAddUni ? 'Cancel' : '+ Add University'}
          </button>
        )}
      </div>

      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg flex justify-between">
          {msg} <button onClick={() => setMsg('')}>✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-[#E6E8F0] flex gap-6">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium transition-colors ${tab === t ? 'border-b-2 border-[#7B5CFF] text-[#7B5CFF]' : 'text-[#6B7280] hover:text-[#1F2937]'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading && <p className="text-[#6B7280] text-sm">Loading data...</p>}

      {/* Add University Form */}
      {tab === 'Universities' && showAddUni && (
        <div className="card bg-[#F9FAFB] border-dashed border-2 border-[#D1D5DB]">
          <h2 className="font-bold text-[#1F2937] mb-4">Add New University</h2>
          <form onSubmit={addUniversity} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">University Name</label>
                <input required className="input" value={addUniForm.name} onChange={e => setAddUniForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g., University of Oxford" />
              </div>
              <div>
                <label className="label">Country</label>
                <select required className="input" value={addUniForm.countryId} onChange={e => setAddUniForm(p => ({ ...p, countryId: e.target.value }))}>
                  <option value="">Select Country</option>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">QS Ranking</label>
                <input className="input" type="number" value={addUniForm.ranking} onChange={e => setAddUniForm(p => ({ ...p, ranking: e.target.value }))} placeholder="e.g., 5" />
              </div>
              <div>
                <label className="label">Website</label>
                <input className="input" value={addUniForm.website} onChange={e => setAddUniForm(p => ({ ...p, website: e.target.value }))} placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input h-24 resize-none" value={addUniForm.description} onChange={e => setAddUniForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm px-6 h-10">Create University</button>
              <button type="button" onClick={() => setShowAddUni(false)} className="btn-secondary text-sm px-6 h-10">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Overview */}
      {tab === 'Overview' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map(s => (
            <div key={s.label} className="card text-center">
              <p className="text-3xl mb-2">{s.icon}</p>
              <p className="font-['Poppins'] text-2xl font-bold gradient-text">{s.value}</p>
              <p className="text-xs text-[#6B7280] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Universities */}
      {tab === 'Universities' && (
        <div className="space-y-3">
          {unis.map(u => (
            <div key={u.id} className="card">
              {editId === u.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">University Name</label>
                      <input className="input" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="label">QS Ranking</label>
                      <input className="input" type="number" value={editForm.ranking} onChange={e => setEditForm(p => ({ ...p, ranking: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Website</label>
                    <input className="input" value={editForm.website} onChange={e => setEditForm(p => ({ ...p, website: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <textarea className="input h-20 resize-none" value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="btn-primary text-sm px-4 h-9">Save</button>
                    <button onClick={() => setEditId(null)} className="btn-secondary text-sm px-4 h-9">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#1F2937]">{u.name}</h3>
                      {u.ranking && <span className="badge badge-purple">#{u.ranking} QS</span>}
                      <span className="text-xs text-[#9CA3AF]">{u.country?.name}</span>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">{u.description}</p>
                    <p className="text-xs text-[#7B5CFF] mt-1">{u.programs?.length ?? 0} programs · <a href={u.website} className="underline" target="_blank" rel="noopener noreferrer">website ↗</a></p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { setEditId(u.id); setEditForm({ name: u.name, description: u.description ?? '', website: u.website ?? '', ranking: u.ranking?.toString() ?? '' }); }}
                      className="btn-secondary text-xs px-3 h-8">Edit</button>
                    <button onClick={() => deleteUni(u.id)}
                      className="px-3 h-8 rounded-lg border border-red-200 text-red-500 text-xs hover:bg-red-50 transition-colors">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {tab === 'Users' && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F8FC] border-b border-[#E6E8F0]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280]">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280]">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280]">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E8F0]">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1F2937]">{u.name || '—'}</p>
                    <p className="text-xs text-[#6B7280]">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`badge ${u.role === 'SUPER_ADMIN' ? 'badge-green' : u.role === 'ADMIN' ? 'badge-blue' : 'badge-purple'}`}>{u.role}</span>
                      {u.role !== 'SUPER_ADMIN' && u.id !== user.id && (
                        <button onClick={() => toggleRole(u.id, u.role)} className="text-[10px] text-[#7B5CFF] hover:underline uppercase font-bold">
                          {u.role === 'ADMIN' ? 'Demote' : 'Make Admin'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {u.id !== user.id && u.role !== 'SUPER_ADMIN' && (
                      <button onClick={() => deleteUser(u.id)}
                        className="px-3 h-7 rounded-lg border border-red-200 text-red-500 text-xs hover:bg-red-50 transition-colors">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
