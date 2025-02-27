import React from "react";

export default function Layout({ children }) {
  return (
    <div className="bg-dark text-light min-h-screen flex flex-col items-center justify-center">
      <main className="w-full max-w-4xl p-6">{children}</main>
    </div>
  );

