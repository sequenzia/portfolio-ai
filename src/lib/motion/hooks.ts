"use client";

import { useState, useEffect, useMemo } from "react";
import { buttonTap, buttonTapMobile, buttonHover } from "./variants";

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export function useAnimationConfig() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  return useMemo(
    () => ({
      shouldAnimate: !prefersReducedMotion,
      isMobile,
      tapGesture: isMobile ? buttonTapMobile : buttonTap,
      hoverGesture: isMobile ? {} : buttonHover,
    }),
    [prefersReducedMotion, isMobile]
  );
}
