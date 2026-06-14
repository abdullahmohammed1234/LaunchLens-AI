"use client";

import { motion } from "framer-motion";
import { Loading } from "@/components/ui/loading";

const MESSAGES = [
  "Analyzing portfolio health...",
  "Evaluating project trends...",
  "Generating founder insights...",
];

interface PortfolioLoadingProps {
  message?: string;
  rotating?: boolean;
  className?: string;
}

export function PortfolioLoading({
  message,
  rotating = false,
  className,
}: PortfolioLoadingProps) {
  const displayMessage =
    message ?? (rotating ? MESSAGES[0] : "Loading portfolio...");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      <Loading size="lg" text={displayMessage} />
      {rotating && (
        <motion.div
          className="mt-6 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {MESSAGES.map((msg, i) => (
            <motion.span
              key={msg}
              className="h-1.5 w-1.5 rounded-full bg-primary/40"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export function PortfolioLoadingOverlay({
  message,
}: {
  message?: string;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <PortfolioLoading message={message} rotating />
    </div>
  );
}
