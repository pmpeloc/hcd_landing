'use client';

import { useEffect } from 'react';
import { initLanding } from '@/lib/landing-runtime';

// Starts the landing's client behavior once the markup is in the DOM.
export function LandingRuntime() {
  useEffect(() => {
    initLanding();
  }, []);
  return null;
}
