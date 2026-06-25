import Navigation from '@/components/Navigation'
import { MessagesSquare } from 'lucide-react'

async function getCollaboration() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/workflows/123`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
  } catch (error) {
    return null;
  }
}

const agentColors: Record<string, string> = {
  "Executive Agent": "from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-200",
  "Production Agent": "from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-200",
  "Inventory Agent": "from-green-500/20 to-green-500/5 border-green-500/30 text-green-200",
  "Procurement Agent": "from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-200"
}

export default async function CollaborationViewer() {
  const messages = await getCollaboration();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <header className="mb-12 text-center">
          <div className="w-16 h-16 mx-auto glass rounded-2xl flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
            <MessagesSquare className="w-8 h-8 text-white relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">Agent Collaboration</h1>
          <p className="text-white/50 mt-3 text-lg">Real-time trace of autonomous agent negotiations.</p>
        </header>
        
        <div className="glass rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
          
          {messages ? (
            <div className="space-y-6 relative z-10">
              {messages.map((msg: any, i: number) => {
                const isRight = i % 2 !== 0;
                const colorStyle = agentColors[msg.agent] || "from-white/10 to-white/5 border-white/10 text-white/90";
                
                return (
                  <div key={i} className={`flex flex-col space-y-2 group ${isRight ? 'items-end' : 'items-start'}`}>
                    <span className="font-heading font-semibold text-white/60 text-sm tracking-wide uppercase px-1 transition-colors group-hover:text-white/80">
                      {msg.agent}
                    </span>
                    <div className={`bg-gradient-to-br ${colorStyle} p-4 rounded-2xl border backdrop-blur-md max-w-[85%] text-sm leading-relaxed shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                      {msg.message}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
             <div className="p-6 border border-red-500/30 rounded-xl bg-red-500/5">
                <p className="text-red-400 text-center">Failed to load collaboration data. Ensure backend is running.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  )
}
