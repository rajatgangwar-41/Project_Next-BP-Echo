import React from "react";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-w-screen min-h-screen h-full flex flex-col justify-center items-center">
      {children}
    </div>
  );
};
