import {Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <button mat-icon-button
            (click)="themeService.darkMode.set(!themeService.darkMode())">
      <mat-icon class="material-symbols-outlined">{{ themeService.darkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
  `
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);
}
