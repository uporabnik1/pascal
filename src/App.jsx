import { useEffect, useState } from 'react';
import { fetchAnswers, updateAnswerStatus } from './api';
import { Search, Users, Activity, TrendingUp, Calendar } from 'lucide-react';
import StatsCard from './components/StatsCard';
import ApplicantCard from './components/ApplicantCard';
import DetailModal from './components/DetailModal';

function App() {
  const [answers, setAnswers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // Poll for data
  useEffect(() => {
    const load = () => fetchAnswers().then(data => {
      // Sort by newest first
      const sorted = (data || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setAnswers(sorted);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter logic
  useEffect(() => {
    if (!search) {
      setFiltered(answers);
    } else {
      const lower = search.toLowerCase();
      setFiltered(answers.filter(a =>
        a.fullName.toLowerCase().includes(lower) ||
        a.email.toLowerCase().includes(lower)
      ));
    }
  }, [search, answers]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const updated = await updateAnswerStatus(id, newStatus);

      // Update local state immediately
      setAnswers(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));

      // Update selected item if open
      if (selected && selected.id === id) {
        setSelected({ ...selected, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Napaka pri posodabljanju statusa.");
    }
  };

  // Stats Logic - Real Data
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Helper for dates
  const isAfter = (dateStr, cutoff) => new Date(dateStr) > cutoff;
  const isBetween = (dateStr, start, end) => {
    const d = new Date(dateStr);
    return d > start && d <= end;
  };

  const total = answers.length;
  const totalLastMonth = answers.filter(a => isAfter(a.timestamp, oneMonthAgo)).length; // Submissions in last 30 days
  const totalPrevMonth = answers.filter(a => isBetween(a.timestamp, twoMonthsAgo, oneMonthAgo)).length; // Submissions 30-60 days ago

  // Calculate trend for Total Submissions (vs last month)
  let totalTrend = "0%";
  if (totalPrevMonth > 0) {
    const growth = ((totalLastMonth - totalPrevMonth) / totalPrevMonth) * 100;
    totalTrend = `${growth > 0 ? '+' : ''}${growth.toFixed(1)}% vs last month`;
  } else if (totalLastMonth > 0) {
    totalTrend = `+100% vs last month`;
  }

  const newThisWeek = answers.filter(a => isAfter(a.timestamp, oneWeekAgo)).length;
  const activeClients = answers.filter(a => a.status === 'active').length;

  // Conversion Rate (Active / Total)
  const conversionRate = total > 0 ? ((activeClients / total) * 100).toFixed(1) + "%" : "0%";

  const stats = {
    total: total,
    totalTrend: totalTrend,
    newThisWeek: newThisWeek,
    active: activeClients,
    conversion: conversionRate
  };

  return (
    <div className="min-h-screen font-sans bg-[#F4EFE6] text-navy pb-20">

      {/* Top Navigation / Branding */}
      <nav className="sticky top-0 z-30 bg-[#F4EFE6]/80 backdrop-blur-md border-b border-navy/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center text-white font-display font-bold">R</div>
            <span className="font-display font-bold text-xl tracking-tight text-navy">Rephase<span className="text-muted font-medium">.admin</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-muted">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Live Updates
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-white shadow-sm">
              <img src="https://ui-avatars.com/api/?name=Pascal+D&background=0B1F3B&color=fff" alt="Admin" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-8">

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-navy mb-2">Dashboard</h1>
          <p className="text-muted text-lg">Pregled prijav in statusa coachinga.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard title="Skupaj Prijav" value={stats.total} icon={Users} trend={stats.totalTrend} />
          <StatsCard title="Ta Teden" value={stats.newThisWeek} icon={Calendar} trend="novi" />
          <StatsCard title="Aktivni Klienti" value={stats.active} icon={Activity} />
          <StatsCard title="Conversion Rate" value={stats.conversion} icon={TrendingUp} />
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Išči po imenu ali emailu..."
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/10 transition-all font-medium text-sm placeholder:text-muted/70"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-navy hover:bg-gray-50 transition-colors">
              Export CSV
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
          </div>
        ) : (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted">
                <p>Ni rezultatov za "{search}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                {filtered.map((item, i) => (
                  <ApplicantCard
                    key={item.id || i}
                    data={item}
                    onClick={() => setSelected(item)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {selected && (
        <DetailModal
          data={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </div>
  );
}

export default App;
