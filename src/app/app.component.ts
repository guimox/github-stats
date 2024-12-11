// src/app/app.component.ts

import { Component } from "@angular/core";
import { ContributionsComponent } from "./features/contributions/contributions.components";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContributionsComponent],
  template: `
    <div class="app-container">
      <h1>GitHub Contributions Tracker</h1>
      <app-contributions></app-contributions>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    h1 {
      color: #333;
      margin-bottom: 30px;
    }
  `]
})
export class AppComponent { }
