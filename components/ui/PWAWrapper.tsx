"use client";

import ErrorBoundary from "./ErrorBoundary";
import { PWAProvider } from "./PWAProvider";

interface PWAWrapperProps {
  children: React.ReactNode;
}

export default function PWAWrapper({ children }: PWAWrapperProps) {
  return (
    <ErrorBoundary>
      <PWAProvider>{children}</PWAProvider>
    </ErrorBoundary>
  );
} 