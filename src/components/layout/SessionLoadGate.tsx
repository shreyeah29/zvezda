"use client";

import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { useSessionLoadGate } from "@/hooks/useSessionLoadGate";

type SessionLoadGateProps = {
  children: React.ReactNode;
};

export function SessionLoadGate({ children }: SessionLoadGateProps) {
  const { ready, showLoader, completeLoad } = useSessionLoadGate();

  if (ready) return <>{children}</>;

  return (
    <>
      {showLoader && <LoadingScreen onComplete={completeLoad} />}
    </>
  );
}
