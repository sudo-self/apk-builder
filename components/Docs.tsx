import React, { useState } from 'react';
import { ViewType } from '../types';

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
  -d '{
    "event_type": "apk_build",
    "client_payload": {
      "buildConfig": {
        "buildId": "web-trigger-123",
        "name": "JesseJesse",
        "launchUrl": "https://jessejesse.com",
        "themeColor": "#2196F3",
        "iconChoice": "phone"
      }
    }
  }'`;

  return (
    <div className="bg-white dark:bg-black">
      <main className="mx-auto max-w-4xl px-6 py-20">
        <header className="mb-16">
          <div className="flex items-center gap-3 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            Developer Guide
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl mb-6">Build your own <span className="text-emerald-600">pipeline</span>.</h1>
          <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed mb-8">
            The APK Builder API is built on top of GitHub Repository Dispatches, allowing you to integrate native Android compilation into any workflow.
          </p>
          
          {/* Badges Section */}
          <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700 items-center">
            <a href="https://github.com/sudo-self/apk-builder-actions/actions/workflows/apk-builder.yml" target="_blank" rel="noopener noreferrer">
              <img
                src="https://github.com/sudo-self/apk-builder-actions/actions/workflows/apk-builder.yml/badge.svg"
                alt="GitHub Workflow Status"
                className="hover:opacity-80 transition-opacity"
              />
            </a>
            <img
              src="https://img.shields.io/npm/v/apk-builder-cli?style=flat-square&color=cb3837&label=npm"
              alt="NPM Version"
              className="rounded shadow-sm hover:opacity-80 transition-opacity"
            />
            <img
              src="https://img.shields.io/node/v/apk-builder-cli?style=flat-square&color=43853d&label=node"
              alt="Node Version"
              className="rounded shadow-sm hover:opacity-80 transition-opacity"
            />
            <img
              src="https://img.shields.io/github/license/sudo-self/apk-builder-actions?style=flat-square&color=blue&label=license"
              alt="License"
              className="rounded shadow-sm hover:opacity-80 transition-opacity"
            />
          </div>
        </header>

        <div className="grid gap-12">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-xs text-white">1</span>
              API Integration
            </h2>
            <div className="relative group">
              <div className="absolute right-4 top-4 z-10">
                <button
                  onClick={() => copyToClipboard(curlExample, "api-curl")}
                  className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
                >
                  {copied === "api-curl" ? "COPIED" : "COPY CURL"}
                </button>
              </div>
              <pre className="bg-zinc-950 p-8 rounded-2xl text-emerald-400 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto border border-white/5 shadow-2xl">
                <code>{curlExample}</code>
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-xs text-white">2</span>
              Signed App
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <img src="/demo1.png" className="rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-transform hover:scale-[1.01]" alt="CLI Preview" />
                <p className="text-xs text-zinc-500 font-medium text-center">ready-to-ship</p>
              </div>
              <div className="space-y-4">
                <img src="/demo2.png" className="rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-transform hover:scale-[1.01]" alt="Kotlin Builder" />
                <p className="text-xs text-zinc-500 font-medium text-center">github actions workflow</p>
              </div>
            </div>
          </section>

          <section className="bg-emerald-50 dark:bg-emerald-500/5 rounded-3xl p-10 border border-emerald-100 dark:border-emerald-500/10">
             <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 mb-4">Enterprise Grade Security</h3>
             <p className="text-emerald-700/80 dark:text-emerald-400/60 leading-relaxed">
               Every build is executed in an isolated GitHub Actions ephemeral environment. Your signing keys are handled via GitHub Secrets, ensuring zero-knowledge exposure for production credentials.
             </p>
             <button
               onClick={() => setView('home')}
               className="mt-8 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-colors"
             >
               Go back to App
             </button>
          </section>
        </div>
      </main>
    </div>
  );
};
