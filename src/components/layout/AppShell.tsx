import type { ReactNode } from "react";
import { TopNavbar } from "./TopNavbar";
import { motion } from "framer-motion";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <TopNavbar />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="p-4 sm:p-6 lg:p-8"
      >
        {children}
      </motion.main>
    </div>
  );
}