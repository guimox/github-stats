import { UserData } from "@/types/github-stats";
import { gql } from "@apollo/client";
import client from "./apollo";

export const fetchGitHubStats = async (username: string) => {
  const currentYear = new Date().getFullYear();
  const contributionsByYear = [];

  // Fetch contributions for each of the last 5 years
  for (let i = 0; i < 5; i++) {
    const year = currentYear - i;
    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;

    const { data } = await client.query<{ user: UserData }>({
      query: gql`
        query GetUserStats(
          $username: String!
          $from: DateTime!
          $to: DateTime!
        ) {
          user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
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
          }
        }
      `,
      variables: { username, from, to },
    });

    contributionsByYear.push(data.user.contributionsCollection);
  }

  // Combine contributions from all years
  const allContributionDays = contributionsByYear.flatMap((collection) =>
    collection.contributionCalendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: new Date(day.date),
        count: day.contributionCount,
      }))
    )
  );

  // Calculate monthly contributions over the last 5 years
  const monthlyContributions: { [key: string]: number } = {};
  const currentDate = new Date();
  for (let i = 0; i < 60; i++) {
    // 5 years * 12 months
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const key = `${year}-${month.toString().padStart(2, "0")}`;
    monthlyContributions[key] = 0;
  }

  allContributionDays.forEach((day) => {
    const year = day.date.getFullYear();
    const month = day.date.getMonth() + 1;
    const key = `${year}-${month.toString().padStart(2, "0")}`;
    if (monthlyContributions[key] !== undefined) {
      monthlyContributions[key] += day.count;
    }
  });

  // Convert monthly contributions to an array for the chart
  const monthlyContributionsData = Object.entries(monthlyContributions)
    .map(([date, count]) => ({ date, count }))
    .reverse(); // Sort from oldest to newest

  // Fetch other user data (repositories, pull requests, issues, etc.)
  const { data: userData } = await client.query<{ user: UserData }>({
    query: gql`
      query GetUserStats($username: String!) {
        user(login: $username) {
          name
          contributionsCollection {
            totalCommitContributions
            totalRepositoryContributions
            totalPullRequestContributions
            totalIssueContributions
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
          repositories(first: 100, isFork: false, ownerAffiliations: OWNER) {
            totalCount
            nodes {
              name
              stargazerCount
              forkCount
              isPrivate
              languages(first: 10) {
                edges {
                  size
                  node {
                    name
                  }
                }
              }
              repositoryTopics(first: 10) {
                nodes {
                  topic {
                    name
                  }
                }
              }
              diskUsage
            }
          }
          pullRequests(first: 100) {
            totalCount
          }
          issues(first: 100) {
            totalCount
          }
        }
      }
    `,
    variables: { username },
  });

  const user = userData.user;

  // Calculate total stars and separate public/private repositories
  const totalStars = user.repositories.nodes.reduce(
    (acc, repo) => acc + repo.stargazerCount,
    0
  );
  const publicRepos = user.repositories.nodes.filter(
    (repo) => !repo.isPrivate
  ).length;
  const privateRepos = user.repositories.nodes.filter(
    (repo) => repo.isPrivate
  ).length;

  // Calculate most used languages
  const languageMap = new Map<string, number>();
  user.repositories.nodes.forEach((repo) => {
    repo.languages.edges.forEach((edge) => {
      const languageName = edge.node.name;
      const languageSize = edge.size;
      if (languageMap.has(languageName)) {
        languageMap.set(
          languageName,
          languageMap.get(languageName)! + languageSize
        );
      } else {
        languageMap.set(languageName, languageSize);
      }
    });
  });

  // Convert language map to an array of { name, size } objects
  const languages = Array.from(languageMap.entries()).map(([name, size]) => ({
    name,
    size,
  }));

  // Sort languages by size (descending)
  languages.sort((a, b) => b.size - a.size);

  // Calculate total repository size (in KB)
  const totalRepoSize = user.repositories.nodes.reduce(
    (acc, repo) => acc + repo.diskUsage,
    0
  );

  // Get repository topics
  const topics = new Set<string>();
  user.repositories.nodes.forEach((repo) => {
    repo.repositoryTopics.nodes.forEach((topic) => {
      topics.add(topic.topic.name);
    });
  });

  // Calculate longest streak without committing
  const contributionDays =
    user.contributionsCollection.contributionCalendar.weeks
      .flatMap((week) => week.contributionDays)
      .map((day) => ({
        date: new Date(day.date),
        count: day.contributionCount,
      }));

  let longestStreakWithoutCommitting = 0;
  let currentStreak = 0;

  for (let i = 0; i < contributionDays.length; i++) {
    if (contributionDays[i].count === 0) {
      currentStreak++;
    } else {
      if (currentStreak > longestStreakWithoutCommitting) {
        longestStreakWithoutCommitting = currentStreak;
      }
      currentStreak = 0;
    }
  }

  // Check the last streak in case it's the longest
  if (currentStreak > longestStreakWithoutCommitting) {
    longestStreakWithoutCommitting = currentStreak;
  }

  return {
    name: user.name,
    totalCommits: user.contributionsCollection.totalCommitContributions,
    totalRepos: user.repositories.totalCount,
    totalStars,
    totalPullRequests: user.pullRequests.totalCount,
    totalIssues: user.issues.totalCount,
    publicRepos,
    privateRepos,
    totalRepoSize,
    languages,
    topics: Array.from(topics),
    longestStreakWithoutCommitting,
    contributionCalendar: user.contributionsCollection.contributionCalendar,
    monthlyContributions: monthlyContributionsData,
  };
};
