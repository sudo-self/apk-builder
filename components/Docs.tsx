import React, { useState } from 'react';
import { ViewType } from '../types';
import { Terminal, Shield, Package, ArrowLeft, Copy, Check, Cpu, Zap, Activity, Key } from 'lucide-react';

interface DocsProps {
  setView: (view: ViewType) => void;
}

export const Docs: React.FC<DocsProps> = ({ setView }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const curlExample = `curl -X POST \\
  -H "Authorization: token $GITHUB_TOKEN" \\
  -H "Accept: application/vnd.github.v3+json" \\
  https://api.github.com/repos/sudo-self/apk-builder-actions/dispatches \\
  -d '{\n    "event_type": "apk_build",\n    "client_payload": {\n      "buildId": "cli-trigger-123",\n      "name": "YourAppName",\n      "launchUrl": "https://your-app-url.com",\n      "themeColor": "#2196F3",\n      "iconChoice": "phone"\n    }\n  }'`;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-400">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]"/>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;400;600;800&display=swap');
        
        body { font-family: 'Inter', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        
        .obsidian-glass {
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .reveal { animation: reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes reveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes type-line {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .line-by-line {
          opacity: 0;
          animation: type-line 0.5s ease-out forwards;
        }
      `}} />

      <main className="relative mx-auto max-w-5xl px-6 py-24 z-10">
        <nav className="mb-20 flex justify-between items-center reveal" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setView('home')}
            className="group flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-zinc-500 hover:text-emerald-400 transition-all"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-zinc-800" />
            <span className="text-[10px] font-mono text-zinc-600 transition-colors hover:text-emerald-400">actions/upload-artifact@v4</span>
          </div>
        </nav>

        <header className="mb-24 relative">
          <div className="absolute -left-12 top-0 h-full w-px bg-gradient-to-b from-emerald-500/50 via-emerald-500/10 to-transparent" />
          <div className="flex items-center gap-3 text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-6 reveal" style={{ animationDelay: '0.2s' }}>
            <Activity size={16} strokeWidth={3} />
            Linux android VM
          </div>
          <h1 className="text-5xl sm:text-7xl font-[800] tracking-tighter text-white mb-8 reveal leading-[0.9]" style={{ animationDelay: '0.3s' }}>
            Built from Android Studio <span className="text-purple-400">Kotlin</span> and modified with <span className="text-yellow-400">python</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-10 reveal" style={{ animationDelay: '0.4s' }}>
            The final output is a compiled, signed, and stable ship-ready binary. No deeplinking or web-view wrapping is required as this is a production-grade Android package.
          </p>
          <div className="flex flex-wrap gap-4 items-center reveal" style={{ animationDelay: '0.5s' }}>
            <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/5">
                <a href="https://github.com/sudo-self/apk-builder-actions" className="hover:opacity-80 transition-opacity">
                    <img src="https://github.com/sudo-self/apk-builder-actions/actions/workflows/apk-builder.yml/badge.svg" alt="Status" className="h-5" />
                </a>
                <img src="https://img.shields.io/npm/v/apk-builder-cli?style=flat-square&color=10b981&label=npm" alt="NPM" className="h-5" />
                <img src="https://img.shields.io/github/license/sudo-self/apk-builder-actions?style=flat-square&color=0ea5e9&label=license" alt="License" className="h-5" />
            </div>
          </div>
        </header>

        <div className="grid gap-32">
          <section className="relative reveal" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-start gap-8 mb-10">
                <div className="flex-none w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xl font-bold">01</div>
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Automated Dispatch</h2>
                    <p className="text-zinc-500 text-sm font-medium">Trigger builds from any environment via authenticated REST calls. The web interface uses a secure serverless function to proxy these requests, so your GitHub token is never exposed.</p>
                </div>
            </div>
            <div className="relative group obsidian-glass rounded-2xl overflow-hidden border border-white/10">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-mono text-zinc-400 tracking-wider">POST /repos/:owner/:repo/dispatches</span>
                    </div>
                    <button onClick={() => copyToClipboard(curlExample, "api-curl")} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all active:scale-95">
                        {copied === "api-curl" ? <Check size={12} /> : <Copy size={12} />}
                        {copied === "api-curl" ? "Copied" : "Copy Source"}
                    </button>
                </div>
                <div className="p-8 overflow-x-auto">
                    <pre className="mono text-sm leading-relaxed text-zinc-300">
                        {curlExample.split('\n').map((line, i) => (
                            <div key={i} className="table-row">
                                <span className="table-cell pr-6 text-zinc-700 select-none text-right text-xs">{(i + 1).toString().padStart(2, '0')}</span>
                                <span className="table-cell">
                                    {line.includes('token') ? (<span>{line.split('token')[0]}<span className="text-emerald-500">token $GITHUB_TOKEN</span>{line.split('token')[1]}</span>) : line.includes('https') ? (<span className="text-cyan-400">{line}</span>) : (line)}
                                </span>
                            </div>
                        ))}
                    </pre>
                </div>
            </div>
          </section>

          <section className="reveal" style={{ animationDelay: '0.7s' }}>
             <div className="flex items-start gap-8 mb-12">
                <div className="flex-none w-12 h-12 flex items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xl font-bold">02</div>
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Build Monitoring</h2>
                    <p className="text-zinc-500 text-sm font-medium">Real-time status updates and artifact generation visualization.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group relative">
                <div className="relative obsidian-glass rounded-2xl p-2 h-full">
                    <div className="aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-white/5 relative">
                         <div className="absolute inset-0 flex items-center justify-center text-zinc-800"><Cpu size={48} strokeWidth={1} /></div>
                         <img src="https://apk.jessejesse.com/apk.png" className="w-full h-full object-cover" alt="Interface 1" />
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Signed APK Artifact</span>
                        <div className="flex gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /><div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.2s' }} /></div>
                    </div>
                </div>
              </div>
              <div className="group relative">
                <div className="relative obsidian-glass rounded-2xl p-2 h-full">
                    <div className="aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-white/5 relative">
                         <div className="absolute inset-0 flex items-center justify-center text-zinc-800"><Package size={48} strokeWidth={1} /></div>
                         <img src="https://apk.jessejesse.com/icon-512.png" className="w-full h-full object-cover" alt="Interface 2" />
                    </div>
                    <div className="p-4 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Native Android Build</span>
                        <div className="text-[10px] font-mono text-cyan-400">READY</div>
                    </div>
                </div>
              </div>
            </div>
          </section>

          <section className="reveal" style={{ animationDelay: '0.8s' }}>
            <a href="https://github.com/sudo-self/apk-builder-actions/blob/1fdd7959bd21a442b36b08cd7c81b13c00b0246b/my-release-key.jks" target="_blank" rel="noopener noreferrer" className="block relative group obsidian-glass rounded-2xl overflow-hidden border border-white/10 p-8 hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-emerald-500"><Key size={24} /></div>
                <div>
                  <h3 className="text-lg font-bold text-white">Release Key</h3>
                  <p className="text-sm text-zinc-500">Access the JKS key required for signing and updating your app.</p>
                </div>
              </div>
            </a>
          </section>

          <section className="reveal" style={{ animationDelay: '0.9s' }}>
            <div className="relative group obsidian-glass rounded-2xl overflow-hidden border border-white/10">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-mono text-zinc-400 tracking-wider">npx apk-builder-cli</span>
                </div>
              </div>
              <div className="p-8 overflow-x-auto">
                <pre className="mono text-sm leading-loose text-zinc-300">
                  <div className="line-by-line" style={{ animationDelay: '0.2s' }}><span className="text-emerald-400">-&gt; %</span> npx apk-builder-cli</div>
                  <div className="line-by-line" style={{ animationDelay: '0.8s' }}> </div>
                  <div className="line-by-line" style={{ animationDelay: '1.0s' }}>🚀 <span className="text-emerald-400 font-bold">APK Builder CLI</span></div>
                  <div className="line-by-line" style={{ animationDelay: '1.2s' }}><span className="text-zinc-400">Build Android APKs from any website</span></div>
                  <div className="line-by-line" style={{ animationDelay: '1.4s' }}> </div>
                  <div className="line-by-line" style={{ animationDelay: '1.6s' }}><span className="text-cyan-400">?</span> <span className="font-bold">GitHub Personal Access Token:</span><span className="text-zinc-500"> *************</span></div>
                  <div className="line-by-line" style={{ animationDelay: '1.8s' }}><span className="text-cyan-400">?</span> <span className="font-bold">Website domain (e.g., example.com):</span> example.com</div>
                  <div className="line-by-line" style={{ animationDelay: '2.0s' }}><span className="text-cyan-400">?</span> <span className="font-bold">App name:</span> Example</div>
                  <div className="line-by-line" style={{ animationDelay: '2.2s' }}><span className="text-cyan-400">?</span> <span className="font-bold">Launch URL:</span> /</div>
                  <div className="line-by-line" style={{ animationDelay: '2.4s' }}><span className="text-cyan-400">?</span> <span className="font-bold">Launcher name:</span> Example</div>
                  <div className="line-by-line" style={{ animationDelay: '2.6s' }}><span className="text-cyan-400">?</span> <span className="font-bold">Theme color (HEX):</span> #3B82F6</div>
                  <div className="line-by-line" style={{ animationDelay: '2.8s' }}><span className="text-cyan-400">?</span> <span className="font-bold">Dark theme color (HEX):</span> #1E40AF</div>
                  <div className="line-by-line" style={{ animationDelay: '3.0s' }}><span className="text-cyan-400">?</span> <span className="font-bold">Background color (HEX):</span> #FFFFFF</div>
                  <div className="line-by-line" style={{ animationDelay: '3.2s' }}><span className="text-cyan-400">?</span> <span className="font-bold">App icon:</span></div>
                  <div className="line-by-line" style={{ animationDelay: '3.4s' }}><span className="text-emerald-500">❯ 📱 Phone</span></div>
                  <div className="line-by-line" style={{ animationDelay: '3.5s' }}><span className="text-zinc-500">  🚀 Rocket</span></div>
                  <div className="line-by-line" style={{ animationDelay: '3.6s' }}><span className="text-zinc-500">  🛡️ Shield</span></div>
                </pre>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="fixed top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent pointer-events-none" />
      <div className="fixed top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-zinc-500/5 to-transparent pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-zinc-500/5 to-transparent pointer-events-none" />
    </div>
  );
};

