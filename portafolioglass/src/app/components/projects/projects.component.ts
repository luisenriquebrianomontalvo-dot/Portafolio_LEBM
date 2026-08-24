import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../services/translate.service';
import { StarfieldComponent } from '../starfield/starfield.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface Project {
  id: number;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, StarfieldComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements AfterViewInit {
  translate = inject(TranslateService);

  projects: Project[] = [
    {
      id: 1,
      titleEs: 'Proyecto Destacado 1',
      titleEn: 'Featured Project 1',
      descriptionEs: 'Descripción breve de tu primer proyecto destacado. Explica el problema que resuelve, las funciones clave y la arquitectura utilizada.',
      descriptionEn: 'Brief description of your first featured project. Explain the problem solved, key features, and architecture used.',
      image: '',
      tags: ['Angular / React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      liveUrl: '#',
      githubUrl: '#',
      featured: true
    },
    {
      id: 2,
      titleEs: 'Plataforma Web E-Commerce',
      titleEn: 'E-Commerce Web Platform',
      descriptionEs: 'Tienda en línea moderna con catálogo dinámico, carrito de compras reactivo y pasarela de pago integrada.',
      descriptionEn: 'Modern online store with dynamic catalog, reactive shopping cart, and integrated checkout.',
      image: '',
      tags: ['Next.js', 'TailwindCSS', 'Stripe API', 'MongoDB'],
      liveUrl: '#',
      githubUrl: '#',
      featured: true
    },
    {
      id: 3,
      titleEs: 'Dashboard Administrativo & Analytics',
      titleEn: 'Admin Dashboard & Analytics',
      descriptionEs: 'Panel de control con métricas en tiempo real, gráficos interactivos y gestión integral de usuarios.',
      descriptionEn: 'Control panel with real-time metrics, interactive charts, and user management system.',
      image: '',
      tags: ['TypeScript', 'Three.js / Charts', 'REST API', 'Docker'],
      liveUrl: '#',
      githubUrl: '#',
      featured: true
    },
    {
      id: 4,
      titleEs: 'Aplicación Móvil / Web App',
      titleEn: 'Mobile / Web Application',
      descriptionEs: 'Aplicación multiplataforma con diseño responsivo, autenticación segura y sincronización en la nube.',
      descriptionEn: 'Cross-platform application with responsive design, secure auth, and cloud synchronization.',
      image: '',
      tags: ['React Native / Web', 'Firebase', 'State Management'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 5,
      titleEs: 'Herramienta de Automatización & IA',
      titleEn: 'AI & Automation Tool',
      descriptionEs: 'Solución automatizada para optimización de flujos de trabajo con agentes inteligentes y procesamiento de datos.',
      descriptionEn: 'Automated workflow optimization solution powered by intelligent agents and data processing.',
      image: '',
      tags: ['Python / Node.js', 'AI Agents', 'Automation', 'API'],
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 6,
      titleEs: 'Experiencia Interactiva 3D',
      titleEn: '3D Interactive Experience',
      descriptionEs: 'Experiencia interactiva visual en 3D/WebGL para presentaciones inmersivas de producto.',
      descriptionEn: 'Visual 3D/WebGL interactive experience for immersive product showcases.',
      image: '',
      tags: ['Three.js', 'WebGL', 'GLSL Shaders', 'Web Audio'],
      liveUrl: '#',
      githubUrl: '#'
    }
  ];

  ngAfterViewInit() {
    gsap.utils.toArray<HTMLElement>('.project-glass-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%' },
        opacity: 0,
        y: 40,
        duration: 0.6,
        delay: (i % 3) * 0.1,
        ease: 'power2.out'
      });
    });
  }

  onCardMouseMove(event: MouseEvent, card: HTMLElement) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  }

  onCardMouseLeave(card: HTMLElement) {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  }

  title(p: Project) {
    return this.translate.lang() === 'es' ? p.titleEs : p.titleEn;
  }

  desc(p: Project) {
    return this.translate.lang() === 'es' ? p.descriptionEs : p.descriptionEn;
  }

  t(key: string) {
    return this.translate.t(key);
  }
}
