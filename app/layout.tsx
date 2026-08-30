import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Birthday, Sis! ❤️",
  description: "A special birthday experience just for you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-[#090514] via-[#160a29] to-[#240c2e] min-h-screen text-pink-50 selection:bg-pink-500/30">
        <main className="relative min-h-screen flex flex-col justify-between p-6 max-w-md mx-auto overflow-x-hidden">
          {children}
          <footer className="relative z-10 text-center text-[11px] text-pink-300/40 py-2">
            Made with love ❤️
          </footer>
        </main>
      </body>
    </html>
  );
}