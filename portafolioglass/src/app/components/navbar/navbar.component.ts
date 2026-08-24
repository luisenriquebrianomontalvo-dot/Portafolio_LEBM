import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  theme = inject(ThemeService);
  translate = inject(TranslateService);

  scrolled = signal(false);
  menuOpen = signal(false);
  activeSection = signal('hero');

  navItems = [
    { id: 'hero',           labelKey: 'nav.about' },
    { id: 'skills',         labelKey: 'nav.skills' },
    { id: 'projects',       labelKey: 'nav.projects' },
    { id: 'experience',     labelKey: 'nav.experience' },
    { id: 'certifications', labelKey: 'nav.certifications' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 40);
    this.detectActiveSection();
  }

  private detectActiveSection() {
    const sections = ['hero', 'skills', 'projects', 'experience', 'certifications'];
    for (const id of [...sections].reverse()) {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 220) {
        this.activeSection.set(id);
        break;
      }
    }
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen.set(false);
  }

  t(key: string) {
    return this.translate.t(key);
  }
}
