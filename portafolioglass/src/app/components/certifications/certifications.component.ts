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
      name: 'Certificación Profesional 1',
      issuer: 'Institución / Plataforma Emisora',
      date: '2024',
      url: '#',
      icon: '🏆',
      color: 'var(--accent-blue)'
    },
    {
      name: 'Certificación en Desarrollo Cloud',
      issuer: 'AWS / Google Cloud / Azure',
      date: '2024',
      url: '#',
      icon: '☁️',
      color: 'var(--accent-cyan)'
    },
    {
      name: 'Especialización en Frontend Moderno',
      issuer: 'Plataforma Educativa',
      date: '2023',
      url: '#',
      icon: '💻',
      color: 'var(--accent-green)'
    },
    {
      name: 'Certificación en Arquitectura de Software',
      issuer: 'Institución Tecnológica',
      date: '2023',
      url: '#',
      icon: '⚙️',
      color: 'var(--accent-orange)'
    },
    {
      name: 'Gestión Ágil de Proyectos (SCRUM)',
      issuer: 'Scrum Alliance / Agile Org',
      date: '2022',
      url: '#',
      icon: '🚀',
      color: 'var(--accent-purple)'
    },
    {
      name: 'Certificación en Bases de Datos & SQL',
      issuer: 'Institución Certificadora',
      date: '2022',
      url: '#',
      icon: '🗄️',
      color: 'var(--accent-pink)'
    },
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
