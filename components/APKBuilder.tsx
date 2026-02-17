import React, { useState, useEffect, useRef } from 'react';
import { BuildStatus, ViewType } from '../types';

interface APKBuilderProps {
  setView: (view: ViewType) => void;
}

export const APKBuilder: React.FC<APKBuilderProps> = ({ setView }) => {
  const [url, setUrl] = useState("");
  const [appName, setAppName] = useState("");
  const [status, setStatus] = useState<BuildStatus>(BuildStatus.IDLE);
  const [copied, setCopied] = useState<string | null>(null);
  
  // Monitoring State
  const [runId, setRunId] = useState<number | null>(null);
  const [runStatus, setRunStatus] = useState<string>("idle");
  const [artifactUrl, setArtifactUrl] = useState<string | null>(null);
  const pollingInterval = useRef<any>(null);
  const artifactPollingInterval = useRef<any>(null);

  const isValidUrl = url.startsWith("http://") || url.startsWith("https://");

  const getSafeHost = (inputUrl: string) => {
    try {
      const domain = new URL(inputUrl).hostname;
      const sanitizedDomain = domain.replace(/[^a-zA-Z0-9]/g, "");
      if (sanitizedDomain.toLowerCase() === "null" || sanitizedDomain.length === 0) {
        return "app" + Date.now().toString().slice(-4);
      }
      return sanitizedDomain;
    } catch {
      return "app" + Date.now().toString().slice(-4);
    }
  };

  useEffect(() => {
    return () => { 
      if (pollingInterval.current) clearInterval(pollingInterval.current); 
      if (artifactPollingInterval.current) clearInterval(artifactPollingInterval.current);
    };
  }, []);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const startMonitoring = async (startTime: number) => {
    setStatus(BuildStatus.MONITORING);
    setRunStatus("initializing build...");
    
    let attempts = 0;
    pollingInterval.current = setInterval(async () => {
      attempts++;
      try {
        if (!runId) {
          const res = await fetch(`/api/runs`);
          const data = await res.json();
          const latestRun = data.workflow_runs?.find((run: any) => 
            new Date(run.created_at).getTime() >= startTime - 15000 
          );

          if (latestRun) {
            setRunId(latestRun.id);
            setRunStatus(latestRun.status);
          } else if (attempts > 20) { 
            if (pollingInterval.current) clearInterval(pollingInterval.current);
            setStatus(BuildStatus.ERROR);
          }
          return;
        }

        const res = await fetch(`/api/status?runId=${runId}`);
        const runData = await res.json();
        setRunStatus(runData.status);

        if (runData.status === "completed") {
          if (pollingInterval.current) clearInterval(pollingInterval.current);

          if (runData.conclusion === "success") {
            setRunStatus("finalizing build...");
            
            let artifactAttempts = 0;
            const maxArtifactAttempts = 30;
            artifactPollingInterval.current = setInterval(async () => {
              if (artifactAttempts >= maxArtifactAttempts) {
                clearInterval(artifactPollingInterval.current);
                setStatus(BuildStatus.SUCCESS);
                setRunStatus("completed");
                setArtifactUrl(`https://github.com/sudo-self/apk-builder-actions/actions/runs/${runId}`);
                return;
              }
              artifactAttempts++;

              try {
                const artifactRes = await fetch(`/api/artifacts?runId=${runId}`);
                const artifactData = await artifactRes.json();
                
                // Find the first artifact that is an APK file.
                const targetArtifact = artifacts.find((art: any) => art.name.endsWith('.apk') || (art.archive_download_url && art.archive_download_url.endsWith('.zip')));

                if (targetArtifact) {
                    clearInterval(artifactPollingInterval.current);
                    setStatus(BuildStatus.SUCCESS);
                    setRunStatus("completed");
                    setArtifactUrl(targetArtifact.archive_download_url);
                }
              } catch (e) {
                  console.error("Error polling for artifact:", e);
              }
            }, 3000);

          } else {
            setStatus(BuildStatus.ERROR);
            setRunStatus(runData.conclusion || "failed");
          }
        }
      } catch (e) { 
        if (pollingInterval.current) clearInterval(pollingInterval.current);
        setStatus(BuildStatus.ERROR);
      }
    }, 5000);
  };

    const [isDownloading, setIsDownloading] = useState(false);
  
    const handleDownload = async () => {
      if (!artifactUrl) return;
      setIsDownloading(true);
  
      try {
        // Always use the secure download endpoint
        window.location.href = `/api/download?url=${encodeURIComponent(artifactUrl)}`;
      } catch (error) {
        console.error("Download failed:", error);
        alert("An error occurred while downloading the artifact. Please try again from the GitHub Actions page.");
      } finally {
        // Add a delay to give the download time to start
        setTimeout(() => setIsDownloading(false), 3000);
      }
    };
  const triggerBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !appName) return;

    console.log("VITE_GITHUB_TOKEN value:", import.meta.env.VITE_GITHUB_TOKEN);

    setStatus(BuildStatus.LOADING);
    setArtifactUrl(null);
    setRunId(null);
    setRunStatus("Requesting build...");
    
    const triggerTime = Date.now();
    const safeHost = getSafeHost(url);
    
    try {
      const response = await fetch(`/api/build`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buildConfig: {
            buildId: `web-${triggerTime}`,
            hostName: safeHost,
            name: appName,
            launchUrl: url,
            launcherName: appName,
            themeColor: "#2196F3",
            iconChoice: "phone"
          }
        })
      });

      if (response.ok) {
        startMonitoring(triggerTime);
      } else {
        setStatus(BuildStatus.ERROR);
      }
    } catch (err) { 
      setStatus(BuildStatus.ERROR); 
    }
  };

  const isFormVisible = status === BuildStatus.IDLE || status === BuildStatus.ERROR || status === BuildStatus.LOADING;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 sharp-bg">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
        {/* Left Section: Controls and Form */}
        <section className="flex flex-col gap-10">
          <div className="text-left animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tighter sm:text-7xl">
              <span className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">Native </span>
              <span className="text-emerald-600">Android Apps</span> 
              <span className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent"> from any URL.</span>
            </h1>
            <p className="mt-8 text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
              Zero-code environment to production-ready Android packages. Native HQ Gradle builds with <span className="text-pink-500 font-semibold italic">Kotlin —</span>
            </p>
          </div>

          <div className="flex flex-col gap-6 max-w-md">
            {/* Step 1: CLI Info */}
            <div className="relative group rounded-3xl">
              <div className="glow-container rounded-2xl border border-zinc-200 bg-white p-6 dark:bg-zinc-900 dark:border-zinc-800 transition-all shadow-lg hover:shadow-emerald-500/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">NPM</div>
                  {copied === "install" && <span className="text-[10px] font-bold text-emerald-600 animate-pulse">Copied!</span>}
                </div>
                <button 
                  onClick={() => copyToClipboard("npx apk-builder-cli", "install")} 
                  className="flex w-full items-center justify-between rounded-xl bg-zinc-50 border border-zinc-200 p-4 font-mono text-sm dark:bg-black dark:border-zinc-800 hover:border-emerald-500 transition-colors group"
                >
                  <code className="text-zinc-700 dark:text-zinc-300 overflow-hidden text-ellipsis whitespace-nowrap">
                    <span className="text-zinc-400 mr-2">$</span>npx apk-builder-cli
                  </code>
                  <svg className="h-4 w-4 text-zinc-400 flex-shrink-0 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
              </div>
            </div>

            {/* Step 2: Build Form or Progress */}
            <div className="relative group rounded-3xl">
              <div className="glow-container rounded-2xl border border-zinc-200 bg-white p-6 dark:bg-zinc-900 dark:border-zinc-800 transition-all shadow-lg hover:shadow-emerald-500/10 relative overflow-hidden">
                <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-4">BUILD DEMO</div>
                
                {isFormVisible ? (
                  <form onSubmit={triggerBuild} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Destination URL</label>
                      <input 
                        type="url" 
                        required
                        placeholder="https://example.com" 
                        value={url} 
                        onChange={(e) => setUrl(e.target.value)} 
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:bg-black dark:border-zinc-800 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">App Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="App Name" 
                        value={appName} 
                        onChange={(e) => setAppName(e.target.value)} 
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:bg-black dark:border-zinc-800 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" 
                      />
                    </div>
                    <button 
                      disabled={!isValidUrl || !appName || status === BuildStatus.LOADING} 
                      className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 relative group overflow-hidden"
                    >
                      <span className="relative z-10">{status === BuildStatus.LOADING ? "Requesting Build..." : "Build Production APK"}</span>
                      {status === BuildStatus.LOADING && (
                        <div className="absolute inset-0 bg-emerald-700 animate-pulse" />
                      )}
                    </button>
                    {status === BuildStatus.ERROR && (
                      <p className="text-xs text-red-500 font-medium text-center bg-red-50 dark:bg-red-900/10 p-3 rounded-lg mt-2 border border-red-100 dark:border-red-900/20">
                        Build dispatch failed. Check your GitHub Token and try again.
                      </p>
                    )}
                  </form>
                ) : (
                  <div className="py-4 space-y-6">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Build Status</p>
                        <h4 className={`text-lg font-bold tracking-tight capitalize ${status === BuildStatus.SUCCESS ? 'text-emerald-600' : 'text-zinc-900 dark:text-white'}`}>
                          {runStatus.replace(/_/g, ' ')}
                        </h4>
                      </div>
                      {runId && (
                        <a 
                          href={`https://github.com/sudo-self/apk-builder-actions/actions/runs/${runId}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1 group"
                        >
                          VIEW LOGS
                          <svg className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      )}
                    </div>

                    <div className="relative h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-emerald-500 transition-all duration-1000 relative ${status === BuildStatus.SUCCESS ? 'w-full' : (runId ? 'w-[75%]' : 'w-[25%]')}`}
                      >
                        {status !== BuildStatus.SUCCESS && (
                          <div className="absolute inset-0 bg-white/30 animate-progress" />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => setStatus(BuildStatus.IDLE)} 
                        className="flex-1 text-[11px] text-zinc-400 uppercase tracking-widest font-bold hover:text-zinc-900 dark:hover:text-white transition-colors py-2"
                      >
                        Reset
                      </button>
                      {status === BuildStatus.SUCCESS && artifactUrl && (
                        <button 
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex-1 text-center bg-emerald-600 text-white text-[11px] uppercase tracking-widest font-bold py-2 rounded-lg shadow-md hover:bg-emerald-700 transition-all disabled:opacity-50"
                      >
                        {isDownloading ? "Downloading..." : "Download APK"}
                      </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="group rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 transition-all hover:shadow-xl hover:shadow-emerald-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">GitHub Token</div>
              </div>
              <a 
                href="https://github.com/settings/tokens/new?scopes=repo,workflow&description=apk-builder-web-interface" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 p-4 font-mono text-sm dark:bg-black dark:border-zinc-800 hover:border-emerald-500 transition-colors group text-zinc-700 dark:text-zinc-300"
              >
                <span className="relative z-10">Get My Token</span>
              </a>
            </div>
          </div>
        </section>

        {/* Right Section: Mobile Preview */}
        <section className="flex flex-col items-center gap-8 py-8 lg:gap-12 lg:sticky lg:top-32 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="relative group rounded-[4rem]">
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
            
            <div className="relative h-[680px] w-[340px] rounded-[3.2rem] border-[12px] border-zinc-700 bg-zinc-800 phone-shadow overflow-hidden ring-1 ring-white/10 transition-transform duration-500 hover:scale-[1.01] phone-grip-texture">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 h-8 w-40 -translate-x-1/2 rounded-b-3xl bg-zinc-900 z-30 flex items-center justify-center">
                <div className="w-12 h-1 rounded-full bg-zinc-800" />
              </div>
              
              <div className="h-full w-full bg-white dark:bg-zinc-950">
                {status === BuildStatus.SUCCESS && artifactUrl ? (
                  <div className="flex h-full flex-col items-center justify-center p-12 text-center bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
                    <div className="relative mb-12">
                      <img 
                        src="/android.svg" 
                        className="w-32 h-32 relative z-10" 
                        alt="Android Logo" 
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {appName}
                      </h3>
                      <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="inline-block bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50"
                      >
                        {isDownloading ? "Downloading..." : `${appName.replace(/\s+/g, '-')}.apk`}
                      </button>
                      <p className="mt-4 text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] text-center">Certified & Signed APK</p>
                    </div>
                  </div>
                ) : (
                  isValidUrl ? (
                    <iframe
                      src={url}
                      className="w-full h-full border-0"
                      title="Website Preview"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-zinc-50 dark:bg-zinc-900">
                      <img src="/icon.svg" className="w-20 h-20 mb-4 opacity-30" alt="Icon" />
                      <p className="text-emerald-600 text-sm">
                        Enter URL to preview your APP
                      </p>
                      <p className="mt-4 text-xs text-zinc-400/80">
                        URL may not be available for preview
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
