import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full overflow-hidden bg-[#050505] pt-20 pb-10 font-sans selection:bg-orange-500/30">
      {/* Tectonic Plate Layering - Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-50" />
        <div className="absolute top-0 left-1/2 h-[1px] w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent blur-sm" />
        
        {/* Industrial Grid Texture */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Main Tectonic Structure */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          
          {/* Left Wing: The Command Forge */}
          <div className="lg:col-span-5">
            <div className="group relative">
              {/* Industrial Bracket */}
              <div className="absolute -left-4 top-0 h-full w-1 bg-zinc-800 transition-all duration-500 group-hover:bg-orange-600" />
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-colors group-hover:text-orange-500/80">
                      NODE Engine
                    </span>
                    <h2 className="font-mono text-2xl font-black tracking-tighter text-zinc-100 sm:text-3xl">
                      npx apk-builder-cli
                    </h2>
                  </div>
                  <div className="mt-4 flex h-8 items-center justify-center border border-zinc-800 bg-zinc-900/50 px-3 font-mono text-[10px] font-bold text-zinc-400 backdrop-blur-sm">
                    V1.2.4
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <a
                    href="https://apk.jessejesse.com"
                    className="group/link flex items-center gap-2 text-xs font-medium tracking-widest text-zinc-500 transition-all hover:text-white"
                  >
                    <span className="h-px w-8 bg-zinc-800 transition-all group-hover/link:w-12 group-hover/link:bg-orange-600" />
                    APK.JESSEJESSE.COM
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Spacer: Structural Rib */}
          <div className="hidden lg:col-span-2 lg:flex lg:justify-center">
             <div className="h-24 w-px bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />
          </div>

          {/* Right Wing: Integrations & Meta */}
          <div className="lg:col-span-5">
            <div className="flex flex-col items-start gap-8 lg:items-end">
              <div className="flex items-center gap-8">
                {/* Github Link with Forged Hover */}
                <a
                  href="https://github.com/sudo-self/apk-builder-actions"
                  className="group/icon relative flex h-12 w-12 items-center justify-center rounded-sm border border-zinc-800 bg-zinc-900/50 transition-all hover:border-orange-500/50 hover:bg-orange-500/5"
                >
                  <svg height="22" viewBox="0 0 16 16" width="22" className="fill-zinc-500 transition-all group-hover/icon:fill-white">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                  </svg>
                  <div className="absolute inset-0 -z-10 bg-orange-500/20 blur-xl transition-opacity opacity-0 group-hover/icon:opacity-100" />
                </a>

                <div className="h-10 w-px bg-zinc-800" />

                {/* Next.js Industrial Mask */}
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/next relative"
                >
                  <img
                    src="https://apk.jessejesse.com/next.svgt"
                    alt="Next.js"
                    width={80}
                    className="invert opacity-30 grayscale transition-all duration-500 group-hover/next:opacity-100 group-hover/next:grayscale-0"
                  />
                </a>
              </div>

              <p className="text-[10px] font-mono tracking-widest text-zinc-600 lg:text-right">
                SYSTEM_STATUS: <span className="text-emerald-500/80">OPERATIONAL</span> //
                REF: <span className="text-zinc-400">BUILD_ARTIFACT_PIPELINE</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Plate */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-zinc-900 pt-8 sm:flex-row">
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-zinc-800" />
            ))}
          </div>
          <span className="text-[9px] font-medium tracking-[0.3em] text-zinc-700 uppercase">
            © 2024 apk.jessejesse.com
          </span>
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-zinc-800" />
            ))}
          </div>
        </div>
      </div>

      {/* Tectonic Spark Effect */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 bg-orange-600/5 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 bg-zinc-900/20 blur-[120px]" />
    </footer>
  );
};

export default Footer;
