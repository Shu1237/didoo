'use client';

import React from 'react';

export default function LayoutAuth({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(at 0% 0%, #764BA2 0%, transparent 50%),
          radial-gradient(at 100% 0%, #FF5ACD 0%, transparent 50%),
          radial-gradient(at 100% 100%, #FBDA61 0%, transparent 50%),
          radial-gradient(at 0% 100%, #00C9FF 0%, transparent 50%),
          #FF9B8A
        `
      }}>
      <main className="relative z-10 w-full max-w-[1200px]">
        {children}
      </main>
    </div>
  );
}