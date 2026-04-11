import { useEffect, useState } from "react";

/**
 * Returns true only after the component has hydrated on the client.
 * Use this to prevent Framer Motion from applying initial={opacity:0}
 * during SSR hydration, which causes a visible flash.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
