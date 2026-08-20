"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  SpeedTestPhase,
  SpeedTestResult,
  DiscoveredServerInfo,
} from "@/lib/speedtest/types";
import {
  runNdt7SpeedTest,
  Ndt7RunController,
} from "@/lib/speedtest/ndt7";

export function useNdt7SpeedTest() {
  const [phase, setPhase] = useState<SpeedTestPhase>("idle");
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [results, setResults] = useState<SpeedTestResult>({
    downloadMbps: null,
    uploadMbps: null,
    pingMs: null,
    jitterMs: null,
  });
  const [serverInfo, setServerInfo] = useState<DiscoveredServerInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [consentAccepted, setConsentAccepted] = useState<boolean>(false);

  const controllerRef = useRef<Ndt7RunController | null>(null);
  const mountedRef = useRef<boolean>(true);
  const targetSpeedRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Smooth visual speed transitions (visual interpolation only)
  const startSpeedAnimation = useCallback(() => {
    if (animFrameRef.current !== null) return;

    const tick = () => {
      if (!mountedRef.current) return;

      setCurrentSpeed((prev) => {
        const target = targetSpeedRef.current;
        const diff = target - prev;
        if (Math.abs(diff) < 0.05) {
          return target;
        }
        // Smooth easing factor
        return prev + diff * 0.25;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const stopSpeedAnimation = useCallback((finalValue = 0) => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    targetSpeedRef.current = finalValue;
    setCurrentSpeed(finalValue);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (controllerRef.current) {
        controllerRef.current.cancel();
        controllerRef.current = null;
      }
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const startTest = useCallback(() => {
    if (!mountedRef.current) return;

    // Prevent double execution
    if (
      phase === "discovering" ||
      phase === "download" ||
      phase === "upload" ||
      phase === "finalizing"
    ) {
      return;
    }

    if (controllerRef.current) {
      controllerRef.current.cancel();
      controllerRef.current = null;
    }

    // Reset session state
    setPhase("discovering");
    targetSpeedRef.current = 0;
    setCurrentSpeed(0);
    setResults({
      downloadMbps: null,
      uploadMbps: null,
      pingMs: null,
      jitterMs: null,
    });
    setServerInfo(null);
    setErrorMessage("");

    startSpeedAnimation();

    const controller = runNdt7SpeedTest(
      {
        userAcceptedDataPolicy: consentAccepted,
        onPhaseChange: (newPhase) => {
          if (!mountedRef.current) return;
          setPhase(newPhase);
          if (newPhase === "completed" || newPhase === "error" || newPhase === "cancelled") {
            stopSpeedAnimation(0);
          }
        },
        onSpeedUpdate: (speedMbps) => {
          if (!mountedRef.current) return;
          targetSpeedRef.current = speedMbps;
        },
        onResultUpdate: (partial) => {
          if (!mountedRef.current) return;
          setResults((prev) => ({
            ...prev,
            ...partial,
          }));
        },
        onServerDiscovered: (server) => {
          if (!mountedRef.current) return;
          setServerInfo(server);
        },
        onError: (msg) => {
          if (!mountedRef.current) return;
          setErrorMessage(msg);
        },
      },
      (finalResult, finalPhase) => {
        if (!mountedRef.current) return;
        setResults((prev) => ({
          downloadMbps: finalResult.downloadMbps ?? prev.downloadMbps,
          uploadMbps: finalResult.uploadMbps ?? prev.uploadMbps,
          pingMs: finalResult.pingMs ?? prev.pingMs,
          jitterMs: finalResult.jitterMs ?? prev.jitterMs,
        }));
        setPhase(finalPhase);
        stopSpeedAnimation(0);
        controllerRef.current = null;
      }
    );

    controllerRef.current = controller;
  }, [phase, consentAccepted, startSpeedAnimation, stopSpeedAnimation]);

  const cancelTest = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.cancel();
      controllerRef.current = null;
    }
    stopSpeedAnimation(0);
    setPhase("cancelled");
  }, [stopSpeedAnimation]);

  const resetTest = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.cancel();
      controllerRef.current = null;
    }
    stopSpeedAnimation(0);
    setPhase("idle");
    setResults({
      downloadMbps: null,
      uploadMbps: null,
      pingMs: null,
      jitterMs: null,
    });
    setServerInfo(null);
    setErrorMessage("");
  }, [stopSpeedAnimation]);

  return {
    phase,
    currentSpeed,
    results,
    serverInfo,
    errorMessage,
    consentAccepted,
    setConsentAccepted,
    startTest,
    cancelTest,
    resetTest,
    isRunning:
      phase === "discovering" ||
      phase === "download" ||
      phase === "upload" ||
      phase === "finalizing",
  };
}
