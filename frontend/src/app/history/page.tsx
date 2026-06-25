import Navigation from '@/components/Navigation'
import { Clock, CheckCircle2, Loader2 } from 'lucide-react'

async function getHistory() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/history`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
  } catch (error) {
    return null;
  }
}

export default async function ExecutionHistory() {
  const history = await getHistory();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <header className="mb-12 text-center">
          <div className="w-16 h-16 mx-auto glass rounded-2xl flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-white/10 blur-xl rounded-full" />
            <Clock className="w-8 h-8 text-white relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">Execution History</h1>
          <p className="text-white/50 mt-3 text-lg">Audit log of all autonomous agent workflows.</p>
        </header>
        
        <div className="glass rounded-3xl p-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <table className="w-full text-sm text-left relative z-10">
            <thead className="text-white/40 uppercase tracking-wider text-xs border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Workflow ID</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Agents Involved</th>
                <th className="px-6 py-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {history ? history.map((item: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5 font-mono text-white/80">{item.id}</td>
                  <td className="px-6 py-5 text-white">{item.type}</td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${
                      item.status === 'Completed' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {item.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                      {item.status}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-white/60">{item.agents}</td>
                  <td className="px-6 py-5 text-white/40">{item.time}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-6">
                    <div className="p-4 border border-red-500/30 rounded-xl bg-red-500/5 text-center text-red-400">
                      Failed to load history. Ensure backend is running.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
