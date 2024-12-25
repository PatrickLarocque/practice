import { Component } from '@angular/core';
import {LangSwitcherComponent} from '../../lang-switcher/lang-switcher.component';
import {MatToolbar} from '@angular/material/toolbar';
import {ThemeSwitcherComponent} from '../../themeswitcher/themeswitcher.component';
import {NgOptimizedImage} from '@angular/common';
import {MatPrefix} from '@angular/material/form-field';

@Component({
    selector: 'app-top-nav',
    imports: [
        LangSwitcherComponent,
        MatToolbar,
        ThemeSwitcherComponent,
        NgOptimizedImage,
        MatPrefix
    ],
    template: `
    <mat-toolbar class="toolbar">
      <img ngSrc='images/intact-financial.png'
           alt="logo"
           height="120"
           width="160"
           class="logo"
           priority/>
      <span class="app-name">UI</span>
      <span class="spacer"></span>
      <app-lang-switcher/>
      <app-theme-switcher/>
    </mat-toolbar>
  `,
    styles: `
    .toolbar {
      box-shadow: var(--mdc-elevated-card-container-elevation, var(--mat-app-level1));
      margin-bottom: 20px;
    }

    .logo {
      object-fit: contain;
    }

    .app-name {
      font-size: 1.2rem;
    }

    .spacer {
      flex: 1 1 auto;
    }
  `
})
export class TopNavComponent {
}
