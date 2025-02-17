"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Title } from "@/components/ui/title";
import { useGitHubStats } from "@/context/github-context";
import { useFetch } from "@/hooks/use-fetch";
import { fetchGitHubStats } from "@/lib/api";
import { Stats } from "@/types/github-stats";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchUser() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const { setStats } = useGitHubStats();
  const { isLoading, data, error, executeFetch, isSuccess } = useFetch<Stats>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await executeFetch(() => fetchGitHubStats(username));
    if (result) {
      setStats(result);
      router.push(`/u/${username}`);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <section className="mx-auto flex-col flex items-center my-20 gap-6">
      <Title>GitHub Wrapped</Title>
      <form onSubmit={handleSubmit} className="w-1/2 space-y-4">
        <Input
          endIcon={Search}
          type="text"
          id="username"
          placeholder="Enter GitHub Username"
          value={username}
          onChange={handleUsernameChange}
          buttonText="Search"
          onButtonClick={handleSubmit}
        />
        {error && <p className="text-red-500">{error.message}</p>}
      </form>
    </section>
  );
}
