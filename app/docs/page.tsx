import React from 'react';
import Link from 'next/link';
import { 
  FiCpu, 
  FiServer, 
  FiTool, 
  FiCode, 
  FiDatabase, 
  FiShield, 
  FiGitPullRequest, 
  FiLayers,
  FiTerminal,
  FiBookOpen
} from 'react-icons/fi';

export const metadata = {
  title: 'Project Overview - Nexo AI',
  description: 'A comprehensive guide to the Nexo AI school project development and logic.',
};

export default function DocsPage() {
  const sections = [
    {
      title: "Core Architecture",
      icon: <FiLayers className="text-blue-400" />,
      desc: "How the Next.js frontend interacts with Hugging Face and Firebase.",
      href: "#architecture"
    },
    {
      title: "AI Logic & Tool Use",
      icon: <FiCpu className="text-purple-400" />,
      desc: "The 'Thinking' process: How Nexo decides which tool to use.",
      href: "#logic"
    },
    {
      title: "Data Pipeline",
      icon: <FiDatabase className="text-yellow-400" />,
      desc: "Managing state with Firestore, Realtime DB, and local context.",
      href: "#data"
    },
    {
      title: "Security & Validation",
      icon: <FiShield className="text-green-400" />,
      desc: "Authentication and input safety measures implemented.",
      href: "#security"
    },
    {
      title: "Web Services",
      icon: <FiServer className="text-pink-400" />,
      desc: "Hugging Face, Firebase, Neon, and Vercel integrations.",
      href: "#services"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Academic Header */}
        <header className="space-y-6 border-b border-gray-800 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 text-gray-400 rounded-full text-xs font-mono border border-white/10">
            <FiBookOpen />
            <span>Academic Project Documentation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">
            Nexo AI <span className="text-blue-500">Unveiled</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
            This project serves as a technical demonstration of modern AI integration. 
            Below is the full breakdown of how Nexo was conceptualized, built, and executed.
          </p>
        </header>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((s) => (
            <a key={s.title} href={s.href} className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-blue-500/50 transition-all duration-300">
              <div className="text-3xl mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3 origin-left">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </a>
          ))}
        </div>

        {/* Deep Dive: Architecture */}
        <section id="architecture" className="space-y-8 pt-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-grow bg-gray-800"></div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <FiLayers className="text-blue-500" /> System Architecture
            </h2>
            <div className="h-px flex-grow bg-gray-800"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-blue-400 font-mono text-sm uppercase font-bold">1. Frontend (User)</h4>
              <p className="text-sm text-gray-400">
                Built with <strong>React 19</strong> and <strong>Material UI</strong>. The UI handles complex state for real-time chat streaming (SSE) and responsive dashboarding.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-purple-400 font-mono text-sm uppercase font-bold">2. The Engine (API)</h4>
              <p className="text-sm text-gray-400">
                Next.js Route Handlers act as the orchestrator. They manage communication between the user and the <strong>Moonshot K2.5</strong> model via Hugging Face.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-yellow-400 font-mono text-sm uppercase font-bold">3. Persistence</h4>
              <p className="text-sm text-gray-400">
                <strong>Firebase</strong> stores chat histories and "Memories"—semantically useful snippets that provide Nexo with long-term context.
              </p>
            </div>
          </div>
        </section>

        {/* Deep Dive: AI Workflow */}
        <section id="logic" className="space-y-8 bg-white/[0.02] p-8 md:p-12 rounded-[40px] border border-white/5">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <FiCpu className="text-purple-500" /> The Intelligence Workflow
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-3xl">
            Nexo isn't just a chatbot; it's an <strong>agentic system</strong>. When you send a message, Nexo follows a multi-step execution cycle:
          </p>
          
          <div className="space-y-12 mt-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black">1</div>
              <div>
                <h3 className="text-white font-bold text-lg mb-2">Dynamic Configuration</h3>
                <p className="text-gray-400 text-sm">The system queries <strong>Vercel Edge Config</strong> to determine which AI model to use (e.g., Kimi-K2.5 vs other variants) without requiring a code redeploy.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black">2</div>
              <div>
                <h3 className="text-white font-bold text-lg mb-2">Contextualization</h3>
                <p className="text-gray-400 text-sm">The system fetches your personal memories and recent chat history to build a personalized system prompt.</p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black">3</div>
              <div>
                <h3 className="text-white font-bold text-lg mb-2">Intent Analysis (Tool Call)</h3>
                <p className="text-gray-400 text-sm">The model analyzes if it needs external data (e.g., "What's the weather?"). If so, it emits a <code className="text-purple-300">tool_call</code> instead of text.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">4</div>
              <div>
                <h3 className="text-white font-bold text-lg mb-2">Execution & Synthesis</h3>
                <p className="text-gray-400 text-sm">The backend executes the requested tool (Web Search, Time, etc.), feeds the results back to the model, and generates a final cohesive response.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Web Services & Providers */}
        <section id="services" className="space-y-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <FiServer className="text-pink-500" /> Web Services & Providers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="text-lg font-bold text-white">Hugging Face</h3>
              <p className="text-sm text-gray-400">
                Acts as the AI backbone. Nexo utilizes the <strong>Inference API</strong> to run the <code className="text-blue-300">moonshotai/Kimi-K2.5</code> model, enabling complex reasoning and tool-calling capabilities.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="text-lg font-bold text-white">Firebase (Google)</h3>
              <p className="text-sm text-gray-400">
                Provides the infrastructure for <strong>Authentication</strong> (Google OAuth), <strong>Realtime Database</strong> for chat sessions, and <strong>Firestore</strong> for user management.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="text-lg font-bold text-white">Neon Database</h3>
              <p className="text-sm text-gray-400">
                A serverless <strong>PostgreSQL</strong> provider used to log system-wide incidents and performance metrics, ensuring high availability and ACID compliance for critical logs.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="text-lg font-bold text-white">Vercel</h3>
              <p className="text-sm text-gray-400">
                The primary hosting platform. Nexo leverages Vercel's <strong>Edge Network</strong> for low-latency delivery, <strong>Blob Storage</strong> for efficient file handling, and <strong>Edge Config</strong> for real-time, zero-latency model switching.
              </p>
            </div>
          </div>
        </section>

        {/* Data Persistence */}
        <section id="data" className="space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <FiDatabase className="text-yellow-500" /> Data Strategy
          </h2>
          <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800">
            <p className="text-gray-400 mb-6">
              To simulate true intelligence and ensure reliability, we utilize a multi-layered database approach:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <li className="space-y-2">
                <span className="text-white font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Realtime Database
                </span>
                <p className="text-xs text-gray-500">Used for high-speed message history and transient session data during active conversations.</p>
              </li>
              <li className="space-y-2">
                <span className="text-white font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Firestore
                </span>
                <p className="text-xs text-gray-500">Primary source for user profiles, persistent settings, and long-term memory records.</p>
              </li>
              <li className="space-y-2">
                <span className="text-white font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Neon (Postgres)
                </span>
                <p className="text-xs text-gray-500">Relational storage dedicated to system incidents, error logging, and operational telemetry.</p>
              </li>
              <li className="space-y-2">
                <span className="text-white font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Vercel Blob
                </span>
                <p className="text-xs text-gray-500">Object storage for static assets and generated files, optimized for rapid retrieval.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Conclusion / Academic Purpose */}
        <footer className="pt-20 pb-12 text-center border-t border-gray-800">
          <h3 className="text-white font-bold mb-4">Educational Objective</h3>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto italic leading-relaxed">
            "This project was developed to explore the boundaries of LLM tool-calling, Server-Sent Events, 
            and modern frontend state management. It stands as a testament to the power of integrating 
            AI agents into everyday web applications."
          </p>
          <div className="mt-8 flex justify-center gap-4">
             <Link href="/" className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors">Return Home</Link>
             <span className="text-gray-800">|</span>
             <Link href="/status" className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors">System Status</Link>
          </div>
        </footer>

      </div>
    </div>
  );
}
