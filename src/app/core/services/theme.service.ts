import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * ThemeService - Manages light/dark theme switching
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme-preference';
  private readonly platformId = inject(PLATFORM_ID);

  // Reactive theme state using Angular Signal
  readonly theme = signal<'light' | 'dark'>(this.getInitialTheme());
  readonly isDark = () => this.theme() === 'dark';

  constructor() {
    // Apply theme class to body when signal changes
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const currentTheme = this.theme();
        document.body.classList.toggle('dark-theme', currentTheme === 'dark');
        localStorage.setItem(this.STORAGE_KEY, currentTheme);
      }
    });
  }

  /** Toggle between light and dark theme */
  toggle(): void {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }

  /** Get initial theme from localStorage or system preference */
  private getInitialTheme(): 'light' | 'dark' {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
}
