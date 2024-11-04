import {Component} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {ThemeSwitcherComponent} from './components/themeswitcher/themeswitcher.component';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {LangSwitcherComponent} from './components/lang-switcher/lang-switcher.component';
import {TopNavComponent} from './components/layout/top-nav/top-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ThemeSwitcherComponent, MatToolbarModule, MatCard, MatCardContent, MatButton, LangSwitcherComponent, TopNavComponent],
  template: `
    <app-top-nav />
    <mat-card>
      <mat-card-content>
        <p>Hello from the internet</p>
        <button mat-flat-button>Click me</button>
      </mat-card-content>
    </mat-card>
  `
})
export class AppComponent {
}
