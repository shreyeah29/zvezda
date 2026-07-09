"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "zvezda:intro-seen";

export function useSessionLoadGate() {
  const [ready, setReady] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    if (seen) {
      setReady(true);
      return;
    }
    setShowLoader(true);
  }, []);

  const completeLoad = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setReady(true);
    setShowLoader(false);
  }, []);

  return { ready, showLoader, completeLoad };
}
