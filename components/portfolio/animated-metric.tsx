"use client";

import { motion } from "framer-motion";
import { useAnimatedNumber } from "@/lib/hooks/use-animated-number";

interface AnimatedMetricProps {
  value: number;
  suffix?: string;
  className?: string;
}

export function AnimatedMetric({
  value,
  suffix = "",
  className,
}: AnimatedMetricProps) {
  const display = useAnimatedNumber(value);

  return (
    <motion.span
      className={className}
      key={value}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
    >
      {display}
      {suffix}
    </motion.span>
  );
}
