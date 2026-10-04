// components/MissionStopwatch.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { TimeLogEntry } from "@/types/missionWork";

interface MissionStopwatchProps {
  /** Called each time the adventurer stops the clock and banks a session. */
  onLogTime?: (entry: TimeLogEntry) => void;
}

type TimerStatus = "idle" | "running" | "paused";

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}

export default function MissionStopwatch({ onLogTime }: MissionStopwatchProps) {
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionLog, setSessionLog] = useState<TimeLogEntry[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Guard against a leaked interval if the component unmounts mid-run.
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function handleStart() {
    if (status === "running") return;
    setStatus("running");
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  }

  function handlePause() {
    if (status !== "running") return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setStatus("paused");
  }

  function handleStop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;

    if (elapsedSeconds > 0) {
      const entry: TimeLogEntry = {
        id: `log-${Date.now()}`,
        seconds: elapsedSeconds,
        loggedAt: new Date().toISOString(),
      };
      setSessionLog((prev) => [entry, ...prev]);
      onLogTime?.(entry);
    }

    setElapsedSeconds(0);
    setStatus("idle");
  }

  const totalLoggedSeconds = sessionLog.reduce((sum, entry) => sum + entry.seconds, 0);

  return (
    <div className="rounded-sm border border-parchment-shadow/60 bg-parchment/90 p-5 shadow-plank">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-oak-dark">
          Billable Hours Clock
        </h2>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
            status === "running"
              ? "border border-rank-b/50 bg-rank-b/20 text-rank-b"
              : status === "paused"
                ? "border border-brass/50 bg-brass/20 text-oak"
                : "border border-oak/20 bg-oak/10 text-oak/60"
          }`}
        >
          {status === "running" ? "Running" : status === "paused" ? "Paused" : "Stopped"}
        </span>
      </div>

      <div className="my-6 text-center">
        <span className="font-mono text-4xl font-bold tabular-nums text-oak-dark">
          {formatDuration(elapsedSeconds)}
        </span>
      </div>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={handleStart}
          disabled={status === "running"}
          className="rounded-sm bg-oak px-4 py-2 font-display text-sm font-semibold text-parchment shadow-sm transition hover:bg-oak-light active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start
        </button>
        <button
          type="button"
          onClick={handlePause}
          disabled={status !== "running"}
          className="rounded-sm border border-brass bg-brass/10 px-4 py-2 font-display text-sm font-semibold text-brass-dark shadow-sm transition hover:bg-brass/20 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={handleStop}
          disabled={status === "idle" && elapsedSeconds === 0}
          className="rounded-sm border border-rank-s bg-rank-s/10 px-4 py-2 font-display text-sm font-semibold text-rank-s shadow-sm transition hover:bg-rank-s/20 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
        >
          Stop &amp; Log
        </button>
      </div>

      {sessionLog.length > 0 && (
        <div className="mt-6 border-t border-oak/10 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-body text-xs uppercase tracking-wide text-oak/60">
              Logged Sessions
            </span>
            <span className="font-mono text-xs font-semibold text-oak-dark">
              Total {formatDuration(totalLoggedSeconds)}
            </span>
          </div>
          <ul className="space-y-1.5">
            {sessionLog.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between font-body text-xs text-oak/70"
              >
                <span>{new Date(entry.loggedAt).toLocaleString()}</span>
                <span className="font-mono font-semibold text-oak-dark">
                  {formatDuration(entry.seconds)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
