// src/app/services/github.service.ts
import { Injectable, inject } from '@angular/core';
import { apolloClient } from '../core/graphql.config';
import { gql } from '@apollo/client/core';

export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionsData {
  totalContributions: number;
  contributionWeeks: ContributionWeek[];
}

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  async getContributions(username: string): Promise<ContributionsData> {
    try {
      const { data } = await apolloClient.query({
        query: gql`
          query($userName: String!) {
            user(login: $userName) {
              contributionsCollection {
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
        variables: { userName: username }
      });

      return {
        totalContributions: data.user.contributionsCollection.contributionCalendar.totalContributions,
        contributionWeeks: data.user.contributionsCollection.contributionCalendar.weeks
      };
    } catch (error) {
      console.error('Error fetching GitHub contributions:', error);
      throw error;
    }
  }
}
