"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Title } from "@/components/ui/title";
import { useGitHubStats } from "@/context/github-context";
import { useFetch } from "@/hooks/use-fetch";
import { fetchGitHubStats } from "@/lib/api";
import { Stats } from "@/types/github-stats";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const { setStats } = useGitHubStats();
  const { isLoading, data, error, executeFetch, isSuccess } = useFetch<Stats>();

  useEffect(() => {
    if (isSuccess) {
      router.push(`/u/${username}`);
    }
  }, [isSuccess, username, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await executeFetch(() => fetchGitHubStats(username));
    if (isSuccess && data !== null) {
      setStats(data);
    }
  };

  return (
    <section className="my-20 space-y-4">
      <Title>GitHub Wrapped</Title>

      <form onSubmit={handleSubmit} className="mb-20 w-1/2 space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            placeholder="Enter GitHub Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Get Stats"}
        </Button>
      </form>

      {error && <p className="text-red-500">{error.message}</p>}
    </section>
  );
}
