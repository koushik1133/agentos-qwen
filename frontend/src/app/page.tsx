import Link from 'next/link'
import { ArrowRight, Brain, Activity, Package, ShieldCheck, Factory } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <main className="max-w-6xl mx-auto px-6 pt-20 pb-24 relative z-10 w-full">
        
        {/* Hero Section */}
        <header className="text-center mb-24 max-w-4xl mx-auto mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-white/80 tracking-wide uppercase">Introducing AgentSwarm OS</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white tracking-tight leading-tight mb-8">
            The Autonomous OS for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
              Modern Manufacturing
            </span>
          </h1>
          
          <p className="text-xl text-white/60 leading-relaxed mb-12 max-w-2xl mx-auto">
            Stop reacting to supply chain bottlenecks. AgentSwarm uses a swarm of autonomous AI agents to proactively monitor, analyze, and resolve production issues in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/dashboard"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-medium overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(94,92,230,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">Launch Dashboard</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a 
              href="https://github.com/koushik1133/agentos-qwen"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-medium hover:bg-white/10 transition-colors"
            >
              View GitHub
            </a>
          </div>
        </header>

        {/* Features / Agents Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-heading font-semibold text-white mb-4">Meet Your Digital Workforce</h2>
          <p className="text-white/50">Four specialized AI agents working together seamlessly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Executive Agent */}
          <div className="glass p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl transition-transform group-hover:scale-150" />
            <Brain className="w-8 h-8 text-blue-400 mb-6 relative z-10" />
            <h3 className="text-xl font-heading font-semibold text-white mb-3 relative z-10">Executive Agent</h3>
            <p className="text-white/60 text-sm leading-relaxed relative z-10">
              The orchestrator. Monitors high-level goals and routes complex tasks to specialized agents.
            </p>
          </div>

          {/* Production Agent */}
          <div className="glass p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl transition-transform group-hover:scale-150" />
            <Factory className="w-8 h-8 text-orange-400 mb-6 relative z-10" />
            <h3 className="text-xl font-heading font-semibold text-white mb-3 relative z-10">Production Agent</h3>
            <p className="text-white/60 text-sm leading-relaxed relative z-10">
              Analyzes factory floor data to optimize scheduling and clear assembly line bottlenecks.
            </p>
          </div>

          {/* Inventory Agent */}
          <div className="glass p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl transition-transform group-hover:scale-150" />
            <Package className="w-8 h-8 text-green-400 mb-6 relative z-10" />
            <h3 className="text-xl font-heading font-semibold text-white mb-3 relative z-10">Inventory Agent</h3>
            <p className="text-white/60 text-sm leading-relaxed relative z-10">
              Tracks raw materials and safety thresholds to prevent line stoppages before they happen.
            </p>
          </div>

          {/* Quality Agent */}
          <div className="glass p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl transition-transform group-hover:scale-150" />
            <ShieldCheck className="w-8 h-8 text-red-400 mb-6 relative z-10" />
            <h3 className="text-xl font-heading font-semibold text-white mb-3 relative z-10">Quality Agent</h3>
            <p className="text-white/60 text-sm leading-relaxed relative z-10">
              Monitors IoT sensor data to detect deviations in tolerances and enforce quality assurance.
            </p>
          </div>

        </div>
        
      </main>
    </div>
  )
}
