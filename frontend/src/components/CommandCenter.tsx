"use client"

import { useState } from 'react'
import { Send, Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CommandCenter() {
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [responses, setResponses] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    setIsGenerating(true)
    setResponses([])
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      
      if (!res.body) throw new Error("No response body")
      
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || '' // Keep the last incomplete chunk in the buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6)
            if (dataStr.trim() === '[DONE]') {
              break
            }
            try {
              const parsed = JSON.parse(dataStr)
              if (parsed.message) {
                setResponses((prev) => [...prev, parsed.message])
              }
            } catch (e) {
              console.error("Error parsing stream chunk", e)
            }
          }
        }
      }
    } catch (err) {
      console.error(err)
      setResponses((prev) => [...prev, "[System Error] Failed to connect to AgentSwarm backend."])
    } finally {
      setIsGenerating(false)
      setInput('')
    }
  }

  return (
    <div className="w-full glass rounded-2xl p-6 relative overflow-hidden mt-12">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-white/10">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-heading font-semibold text-white">Qwen Agent Command Center</h2>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {responses.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {responses.map((resp, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/90 leading-relaxed whitespace-pre-wrap">
                  {resp}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-2 mb-4">
          {[
            "A storm delayed shipments from Supplier Alpha. Source backups.",
            "Machine B in Assembly Line 2 is detecting a 5% deviation.",
            "We received a rush order for 5,000 extra units due Friday."
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInput(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors text-left"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isGenerating}
            placeholder="Type a command (e.g. 'Optimize Production Line A to reduce delay')"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          />
          <button
            type="submit"
            disabled={isGenerating || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  )
}
