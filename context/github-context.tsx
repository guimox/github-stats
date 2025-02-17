import { Stats } from "@/types/github-stats";
import React, { createContext, useContext, useState } from "react";

type GitHubStatsContextType = {
  stats: Stats | null;
  setStats: (stats: Stats | null) => void;
};

const GitHubStatsContext = createContext<GitHubStatsContextType | undefined>(
  undefined
);

export function GitHubStatsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stats, setStats] = useState<Stats | null>(null);

  return (
    <GitHubStatsContext.Provider value={{ stats, setStats }}>
      {children}
    </GitHubStatsContext.Provider>
  );
}

export function useGitHubStats() {
  const context = useContext(GitHubStatsContext);
  if (context === undefined) {
    throw new Error("useGitHubStats must be used within a GitHubStatsProvider");
  }
  return context;
}
