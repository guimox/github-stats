"use client";
import ContributionCalendar from "@/components/overall/contribution-calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Paragraph } from "@/components/ui/paragraph";
import { useGitHubStats } from "@/context/github-context";
import { useFetch } from "@/hooks/use-fetch";
import { fetchGitHubStats } from "@/lib/api";
import { Stats } from "@/types/github-stats";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export default function UserPage() {
  const { username } = useParams<{ username: string }>();
  const { stats, setStats } = useGitHubStats();
  const { data, isLoading, error, executeFetch } = useFetch<Stats>();

  useEffect(() => {
    executeFetch(() => fetchGitHubStats(username));
  }, [username, executeFetch, setStats]);

  useEffect(() => {
    if (data) {
      setStats(data);
    }
  }, [data, setStats]);

  if (isLoading) return <Paragraph>Loading...</Paragraph>;
  if (error) return <Paragraph>Error: {error.message}</Paragraph>;

  const userData = data || stats;
  if (!userData) return null;

  if (userData.totalCommits == 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>This user doesn't have any commits</CardTitle>
        </CardHeader>
        <CardContent>
          <Paragraph>Try again with another username</Paragraph>
        </CardContent>
      </Card>
    );
  }

  // Data for charts
  const languageData = userData.languages.map((lang) => ({
    name: lang.name,
    value: lang.size,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  // Insights
  const busiestMonth = userData.monthlyContributions.reduce(
    (prev, curr) => (curr.count > prev.count ? curr : prev),
    { date: "", count: 0 }
  );
  const totalContributionsLast5Years = userData.monthlyContributions.reduce(
    (acc, curr) => acc + curr.count,
    0
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{userData.name}'s GitHub Wrapped</CardTitle>
        </CardHeader>
        <CardContent>
          <Paragraph>Total Commits: {userData.totalCommits}</Paragraph>
          <Paragraph>Total Repositories: {userData.totalRepos}</Paragraph>
          <Paragraph>Total Stars: {userData.totalStars}</Paragraph>
          <Paragraph>
            Total Pull Requests: {userData.totalPullRequests}
          </Paragraph>
          <Paragraph>Total Issues: {userData.totalIssues}</Paragraph>
          <Paragraph>Public Repositories: {userData.publicRepos}</Paragraph>
          <Paragraph>Private Repositories: {userData.privateRepos}</Paragraph>
          <Paragraph>
            Total Repository Size: {userData.totalRepoSize} KB
          </Paragraph>
          <Paragraph>
            Longest Streak Without Committing:{" "}
            {userData.longestStreakWithoutCommitting} days
          </Paragraph>

          <Paragraph>Contribution Calendar</Paragraph>
          <ContributionCalendar weeks={userData.contributionCalendar.weeks} />

          <Paragraph>Most Used Languages</Paragraph>
          <PieChart width={400} height={400}>
            <Pie
              data={languageData}
              cx={200}
              cy={200}
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {languageData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <Paragraph>Monthly Contributions (Last 5 Years)</Paragraph>
          <LineChart
            width={800}
            height={300}
            data={userData.monthlyContributions}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>

          <Paragraph>Insights</Paragraph>
          <ul className="list-disc pl-5">
            <li>
              Busiest Month: {busiestMonth.date} ({busiestMonth.count}{" "}
              contributions)
            </li>
            <li>
              Total Contributions (Last 5 Years): {totalContributionsLast5Years}
            </li>
          </ul>

          <Paragraph>Repository Topics</Paragraph>
          <div className="flex flex-wrap gap-2">
            {userData.topics.map((topic, index) => (
              <span
                key={index}
                className="bg-gray-200 px-2 py-1 rounded-md text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => console.log("share")}>Share</Button>
        </CardFooter>
      </Card>
    </>
  );
}
