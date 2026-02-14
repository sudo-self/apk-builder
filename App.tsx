
import React, { useState, useEffect } from 'react';
import { APKBuilder } from './components/APKBuilder';
import { Docs } from './components/Docs';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ViewType } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentView={view} onViewChange={setView} />
      
      <main className="flex-grow">
        {view === 'home' ? (
          <APKBuilder setView={setView} />
        ) : (
          <Docs setView={setView} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
