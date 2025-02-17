import React from "react";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface Week {
  contributionDays: ContributionDay[];
}

interface ContributionCalendarProps {
  weeks: Week[];
}

export default function ContributionCalendar({
  weeks,
}: ContributionCalendarProps) {
  return (
    <div className="flex flex-wrap gap-0.5">
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-0.5">
          {week.contributionDays.map((day, dayIndex) => (
            <span
              key={dayIndex}
              className="w-2.5 h-2.5 rounded-[2px]"
              style={{
                backgroundColor:
                  day.contributionCount > 0 ? "green" : "#e1e4e8",
              }}
              title={`${day.date}: ${day.contributionCount} contributions`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
