import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../services/translate.service';
import { StarfieldComponent } from '../starfield/starfield.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule, StarfieldComponent],
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.scss']
})
export class CertificationsComponent implements AfterViewInit {
  translate = inject(TranslateService);
  year = new Date().getFullYear();
  copied = signal<boolean>(false);

  certifications: Certification[] = [
    {
      name: 'Ingeniería en Tecnologías de la Información',
      issuer: 'Universidad Politécnica de San Luis Potosí',
      date: 'En curso',
      icon: '🎓',
      color: 'var(--accent-blue)'
    },
    {
      name: 'Cybersecurity and Cloud Fundamentals 1.0',
      issuer: 'Fortinet',
      date: '2026',
      icon: '🛡️',
      color: 'var(--accent-cyan)'
    },
    {
      name: 'Formación en Instalación de Fibra Óptica',
      issuer: 'FOA - Nivel 1 / Formación académica',
      date: 'En curso',
      icon: '🌐',
      color: 'var(--accent-green)'
    }
  ];

  ngAfterViewInit() {
    gsap.utils.toArray<HTMLElement>('.cert-glass-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%' },
        opacity: 0,
        y: 35,
        duration: 0.6,
        delay: (i % 3) * 0.08,
        ease: 'power2.out'
      });
    });

    gsap.from('.contact-glass-hub', {
      scrollTrigger: { trigger: '.contact-glass-hub', start: 'top 85%' },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out'
    });
  }

  copyEmail() {
    const email = this.translate.t('contact.emailValue');
    navigator.clipboard.writeText(email);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2500);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  t(key: string) {
    return this.translate.t(key);
  }
}
