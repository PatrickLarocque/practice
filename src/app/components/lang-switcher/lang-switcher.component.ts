import {Component, signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgOptimizedImage} from '@angular/common';

@Component({
    selector: 'app-lang-switcher',
    imports: [
        MatIcon,
        MatIconButton,
        NgOptimizedImage,
        MatButton
    ],
    template: `
    <button mat-icon-button (click)="toggleLanguage()">
      <img [ngSrc]="lang() === 'en' ? 'images/united-kingdom.png' : 'images/france.png'"
           [alt]="lang() === 'en' ? 'english' : 'french'"
           height="128"
           width="128"/>
    </button>
  `,
    styles: ``
})
export class LangSwitcherComponent {
  lang = signal<string>('en');

  toggleLanguage() {
    this.lang.update(currentLang => currentLang === 'en' ? 'fr' : 'en');
  }
}
