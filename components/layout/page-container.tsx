"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex-1 space-y-6 p-4 md:p-6 lg:p-8", className)}
    >
      {children}
    </motion.div>
  );
}
