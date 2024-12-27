import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkMode = signal(false);

  _ = effect(() => {
    document.documentElement.classList.toggle('dark', this.darkMode());
  })

}
