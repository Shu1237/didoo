
import React from 'react';


interface LayoutAuthProps {
  children: React.ReactNode;
}

export default function LayoutAuth({ children }: LayoutAuthProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-400 via-blue-500 to-purple-600">
      <main className="w-full max-w-[620px] p-0">
        {children}
      </main>
    </div>
  );
}