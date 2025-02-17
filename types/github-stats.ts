// @/types/github-stats.ts

export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface Week {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: Week[];
}

export interface Repository {
  name: string;
  stargazerCount: number;
  forkCount: number;
  isPrivate: boolean;
  languages: {
    edges: {
      size: number;
      node: {
        name: string;
      };
    }[];
  };
  repositoryTopics: {
    nodes: {
      topic: {
        name: string;
      };
    }[];
  };
  diskUsage: number;
}

export interface UserData {
  name: string;
  contributionsCollection: {
    totalCommitContributions: number;
    totalRepositoryContributions: number;
    totalPullRequestContributions: number;
    totalIssueContributions: number;
    contributionCalendar: ContributionCalendar;
  };
  repositories: {
    totalCount: number;
    nodes: Repository[];
  };
  pullRequests: {
    totalCount: number;
  };
  issues: {
    totalCount: number;
  };
}

export interface Stats {
  name: string;
  totalCommits: number;
  totalRepos: number;
  totalStars: number;
  totalPullRequests: number;
  totalIssues: number;
  publicRepos: number;
  privateRepos: number;
  totalRepoSize: number;
  languages: {
    name: string;
    size: number;
  }[];
  topics: string[];
  longestStreakWithoutCommitting: number;
  contributionCalendar: ContributionCalendar;
  monthlyContributions: { date: string; count: number }[];
}
