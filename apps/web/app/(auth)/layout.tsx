import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-screen min-h-screen h-full flex flex-col justify-center items-center">
      {children}
    </div>
  );
}
