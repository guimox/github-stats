"use client";
import { useState } from "react";
import { gql } from "@apollo/client";
import client from "@/lib/apollo";

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface Week {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: Week[];
}

interface Repository {
  name: string;
  stargazerCount: number;
  forkCount: number;
}

interface UserData {
  name: string;
  contributionsCollection: {
    totalCommitContributions: number;
    totalRepositoryContributions: number;
    contributionCalendar: ContributionCalendar;
  };
  repositories: {
    totalCount: number;
    nodes: Repository[];
  };
}

interface Stats {
  name: string;
  totalCommits: number;
  totalRepos: number;
  totalStars: number;
  contributionCalendar: ContributionCalendar;
}

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await client.query<{ user: UserData }>({
        query: gql`
          query GetUserStats($username: String!) {
            user(login: $username) {
              name
              contributionsCollection {
                totalCommitContributions
                totalRepositoryContributions
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
              repositories(first: 100) {
                totalCount
                nodes {
                  name
                  stargazerCount
                  forkCount
                }
              }
            }
          }
        `,
        variables: { username },
      });

      const userData = data.user;
      setStats({
        name: userData.name,
        totalCommits: userData.contributionsCollection.totalCommitContributions,
        totalRepos: userData.repositories.totalCount,
        totalStars: userData.repositories.nodes.reduce(
          (acc: any, repo: { stargazerCount: any }) =>
            acc + repo.stargazerCount,
          0
        ),
        contributionCalendar:
          userData.contributionsCollection.contributionCalendar,
      });
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      setError(
        "Failed to fetch data. Please check the username and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>GitHub Wrapped</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter GitHub Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          {loading ? "Loading..." : "Get Stats"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {stats && (
        <div style={{ marginTop: "20px" }}>
          <h2>{stats.name}'s GitHub Wrapped</h2>
          <p>Total Commits: {stats.totalCommits}</p>
          <p>Total Repositories: {stats.totalRepos}</p>
          <p>Total Stars: {stats.totalStars}</p>

          <h3>Contribution Calendar</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
            {stats.contributionCalendar.weeks.map((week, index) => (
              <div
                key={index}
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
              >
                {week.contributionDays.map((day, i) => (
                  <span
                    key={i}
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor:
                        day.contributionCount > 0 ? "green" : "#e1e4e8",
                      borderRadius: "2px",
                    }}
                    title={`${day.date}: ${day.contributionCount} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>

          <button
            onClick={shareOnLinkedIn}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
            }}
          >
            Share on LinkedIn
          </button>
        </div>
      )}
    </div>
  );
}
