import Navigation from '@/components/Navigation'
import CommandCenter from '@/components/CommandCenter'
import { Activity, ShieldAlert, TrendingDown, Clock } from 'lucide-react'

async function getMetrics() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/metrics`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function Home() {
  const data = await getMetrics();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">Executive Overview</h1>
          <p className="text-white/50 mt-3 text-lg">Real-time monitoring of your multi-agent manufacturing OS.</p>
        </header>
        
        {data ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Active Workflows</h3>
                  <Activity className="w-5 h-5 text-white/40" />
                </div>
                <p className="text-4xl font-heading font-bold text-white">{data.active_workflows}</p>
              </div>

              <div className="glass p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Agreement Score</h3>
                  <ShieldAlert className="w-5 h-5 text-green-400/60" />
                </div>
                <p className="text-4xl font-heading font-bold text-green-400">{data.agreement_score}%</p>
              </div>

              <div className="glass p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Cost Reduction (Est)</h3>
                  <TrendingDown className="w-5 h-5 text-white/40" />
                </div>
                <p className="text-4xl font-heading font-bold text-white">${data.cost_reduction.toLocaleString()}</p>
              </div>
            </div>

            <CommandCenter />

            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <Clock className="w-5 h-5 text-white/50" />
                <h2 className="text-xl font-heading font-semibold text-white">Recent Autonomous Actions</h2>
              </div>
              <ul className="space-y-4">
                {data.recent_actions.map((action: any, i: number) => (
                  <li key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
                    <span className="text-white/90 font-medium">{action.action}</span>
                    <span className="text-sm text-white/40 font-mono bg-black/40 px-3 py-1 rounded-full">{action.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="glass p-8 rounded-2xl border-red-500/30">
            <p className="text-red-400">Failed to load metrics. Ensure FastAPI backend is running on port 8000.</p>
          </div>
        )}
      </main>
    </div>
  )
}
