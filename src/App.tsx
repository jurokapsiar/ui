import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Sidebar, type AppMode } from './components/Sidebar/Sidebar';
import { DesignSystemProvider, useDesignSystem } from './design-system/DesignSystemContext';
import { BaseUIDesignSystemView } from './components/BaseUIDesignSystem/BaseUIDesignSystemView';

const FluentDesignSystemView = lazy(() =>
  import('./components/FluentDesignSystem/FluentDesignSystemView').then((module) => ({
    default: module.FluentDesignSystemView,
  })),
);

function AppContent() {
  const [mode, setMode] = useState<AppMode>('base-ui');
  const mainRef = useRef<HTMLElement>(null);
  const { selectedComponentId, selectComponent } = useDesignSystem();

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [mode, selectedComponentId]);

  return (
    <div className="min-h-screen flex flex-col min-[901px]:flex-row bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#111113] focus:text-white focus:rounded-md focus:shadow-lg font-mono text-xs"
      >
        Skip to main content
      </a>

      <Sidebar
        mode={mode}
        onModeChange={setMode}
        selectedBaseUIComponent={selectedComponentId}
        onSelectBaseUIComponent={selectComponent}
      />

      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="flex-1 min-w-0 bg-[#ffffff] focus:outline-none"
      >
        <div key={`${mode}-${selectedComponentId}`} className="pageMotionTransition min-h-full">
          {mode === 'base-ui' ? (
            <BaseUIDesignSystemView />
          ) : (
            <Suspense fallback={<p className="p-10 text-sm text-[var(--text-secondary)]" role="status">Loading Fluent UI components</p>}>
              <FluentDesignSystemView />
            </Suspense>
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <DesignSystemProvider>
      <AppContent />
    </DesignSystemProvider>
  );
}
