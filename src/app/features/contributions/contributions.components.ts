// src/app/features/contributions/contributions.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GithubService, ContributionsData, ContributionWeek, ContributionDay } from '../../services/github.service';

@Component({
  selector: 'app-contributions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>GitHub Contributions</h2>

      <div class="input-section">
        <input
          type="text"
          [(ngModel)]="username"
          placeholder="GitHub Username"
          (keyup.enter)="fetchContributions()"
        />
        <button (click)="fetchContributions()">Fetch Contributions</button>
      </div>

      <div *ngIf="contributionsData" class="contributions-summary">
        <h3>Total Contributions: {{ contributionsData.totalContributions }}</h3>

        <div class="contribution-weeks">
          <h4>Contribution Details</h4>
          <div *ngFor="let week of contributionsData.contributionWeeks; let weekIndex = index" class="week">
            <h5>Week {{ weekIndex + 1 }}</h5>
            <div class="contribution-days">
              <div *ngFor="let day of week.contributionDays" class="day"
                   [class.has-contributions]="day.contributionCount > 0">
                <span class="date">{{ day.date }}</span>
                <span class="count">{{ day.contributionCount }} contributions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="error" class="error">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .input-section {
      display: flex;
      margin-bottom: 20px;
    }
    .input-section input {
      flex-grow: 1;
      margin-right: 10px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .input-section button {
      padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .contributions-summary {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      background-color: #f9f9f9;
    }
    .contribution-weeks {
      margin-top: 15px;
    }
    .week {
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .contribution-days {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .day {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 150px;
    }
    .day.has-contributions {
      background-color: #e6f3e6;
    }
    .date {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .count {
      color: #666;
    }
    .error {
      color: red;
      margin-top: 15px;
      text-align: center;
    }
  `]
})
export class ContributionsComponent {
  username: string = '';
  contributionsData: ContributionsData | null = null;
  error: string | null = null;

  constructor(private githubService: GithubService) { }

  async fetchContributions() {
    // Reset previous state
    this.error = null;
    this.contributionsData = null;

    // Validate input
    if (!this.username) {
      this.error = 'Please enter a GitHub username';
      return;
    }

    try {
      // Fetch contributions
      this.contributionsData = await this.githubService.getContributions(this.username);
    } catch (error) {
      // Handle errors
      this.error = 'Failed to fetch contributions. Check username and token.';
      console.error(error);
    }
  }
}
