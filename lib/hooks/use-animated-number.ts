"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export function useAnimatedNumber(
  value: number,
  duration = 1.4,
  enabled = true
): number {
  const [display, setDisplay] = useState(enabled ? 0 : value);

  useEffect(() => {
    if (!enabled) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [value, duration, enabled]);

  return display;
}
