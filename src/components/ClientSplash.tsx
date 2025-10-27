"use client";

import React, { useState, useEffect } from "react";

export default function ClientSplash({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!splashDone) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
        <div className="text-6xl md:text-8xl font-extrabold text-red-600 animate-pulse select-none cursor-default">
          JESÚS
          <div className="h-1 w-full bg-black mt-2 relative overflow-hidden rounded">
            <div className="absolute top-0 left-0 h-1 bg-red-600 animate-expand" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
