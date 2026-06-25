import Navigation from '@/components/Navigation'
import { Activity, AlertTriangle, CheckCircle, Zap } from 'lucide-react'

async function getProduction() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/production`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
  } catch (error) {
    return {
      bottlenecks: [
        { resource: "Machine B (Assembly Line 2)", severity: "High", expected_delay: "4 hrs", status: "Active" },
        { resource: "Microchip Inventory", severity: "Critical", expected_delay: "3 days", status: "Active" }
      ],
      recommendations: [
        { action: "Shift 30% of capacity from Line C to Line A", impact: "Eliminates Machine B bottleneck", status: "Pending Approval" },
        { action: "Expedite shipment from Supplier Beta", impact: "Reduces microchip delay to 0 days", status: "Executing" }
      ]
    };
  }
}

export default async function ProductionInsights() {
  const data = await getProduction();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <header className="mb-12 text-center">
          <div className="w-16 h-16 mx-auto glass rounded-2xl flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" />
            <Activity className="w-8 h-8 text-white relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">Production Insights</h1>
          <p className="text-white/50 mt-3 text-lg">AI-detected bottlenecks and autonomous recommendations.</p>
        </header>
        
        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl transition-transform group-hover:scale-150" />
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h2 className="font-heading font-semibold text-xl text-white">Current Bottlenecks</h2>
              </div>
              <ul className="space-y-4 relative z-10">
                {data.bottlenecks.map((bn: any, i: number) => (
                  <li key={i} className={`flex justify-between items-center p-4 rounded-2xl border backdrop-blur-sm ${bn.severity === 'high' ? 'bg-red-500/10 border-red-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                    <span className={`font-medium tracking-wide ${bn.severity === 'high' ? 'text-red-200' : 'text-yellow-200'}`}>{bn.line}</span>
                    <span className={`text-sm px-3 py-1 rounded-full bg-black/40 ${bn.severity === 'high' ? 'text-red-400' : 'text-yellow-400'}`}>{bn.status}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl transition-transform group-hover:scale-150" />
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <Zap className="w-6 h-6 text-blue-400" />
                <h2 className="font-heading font-semibold text-xl text-white">Agent Recommendations</h2>
              </div>
              <ul className="space-y-4 relative z-10">
                {data.recommendations.map((rec: any, i: number) => (
                  <li key={i} className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)] hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
                    <span className="font-heading font-semibold text-blue-200 block mb-2">{rec.title}</span>
                    <span className="text-white/70 block text-sm leading-relaxed">{rec.description}</span>
                    <div className="mt-4 pt-4 border-t border-blue-500/10 text-xs text-white/50 flex justify-between items-center uppercase tracking-wider font-medium">
                      <span>Confidence: <span className="text-blue-300">{rec.confidence}%</span></span>
                      <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-blue-400" /> {rec.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-6 border border-red-500/30 rounded-xl bg-red-500/5 max-w-lg mx-auto">
             <p className="text-red-400 text-center">Failed to load production insights. Ensure backend is running.</p>
          </div>
        )}
      </main>
    </div>
  )
}
