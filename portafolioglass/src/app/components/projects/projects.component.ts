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
  category: 'redes' | 'soporte' | 'ciberseguridad';
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

  activeFilter = signal<string>('all');
  academicOpen = signal<boolean>(false);

  projects: Project[] = [
    {
      id: 2,
      titleEs: 'Levantamiento de Infraestructura CCTV',
      titleEn: 'CCTV Infrastructure Site Survey',
      descriptionEs: 'Levantamiento técnico para un proyecto de videovigilancia de gran escala, considerando más de 150 cámaras, racks, switches, cableado estructurado, charolas portacables y estimación de materiales.',
      descriptionEn: 'Technical site survey for a large-scale video surveillance project involving more than 150 cameras, racks, switches, structured cabling, cable trays, and material estimation.',
      image: 'assets/images/projects/cctv-infraestructura.png',
      tags: ['CCTV', 'Redes', 'UTP', 'Racks', 'Infraestructura'],
      category: 'redes',
      featured: true
    },
    {
      id: 3,
      titleEs: 'Migración y Configuración ZKTeco / ZKTime.Net',
      titleEn: 'ZKTeco / ZKTime.Net Migration & Configuration',
      descriptionEs: 'Configuración de equipos biométricos, direccionamiento IP, respaldo de información y preparación de la migración del sistema ZKTime.Net entre equipos.',
      descriptionEn: 'Biometric device configuration, IP addressing, data backup, and preparation for migrating a ZKTime.Net system between computers.',
      image: 'assets/images/projects/zkteco-control-acceso.png',
      tags: ['ZKTeco', 'ZKTime.Net', 'Redes', 'Soporte TI', 'Migración'],
      category: 'redes',
      featured: true
    },
    {
      id: 4,
      titleEs: 'Soporte de Correo Corporativo y Outlook',
      titleEn: 'Corporate Email & Outlook Support',
      descriptionEs: 'Diagnóstico de conectividad POP3, administración y migración de archivos PST, configuración de cuentas y resolución de incidencias de correo corporativo.',
      descriptionEn: 'POP3 connectivity troubleshooting, PST file administration and migration, account configuration, and corporate email incident resolution.',
      image: 'assets/images/projects/outlook-soporte.png',
      tags: ['Outlook', 'POP3', 'PST', 'PowerShell', 'Troubleshooting'],
      category: 'soporte'
    }
  ];

  academicProjects: Project[] = [
    {
      id: 101,
      titleEs: 'Laboratorio de Captura y Transmisión de Eventos',
      titleEn: 'Event Capture & Transmission Cybersecurity Lab',
      descriptionEs: 'Laboratorio académico con dos máquinas virtuales. Windows captura eventos de teclado con Python y pynput, agrega marcas temporales y persistencia local, y transmite los registros por TCP hacia un servidor Kali Linux.',
      descriptionEn: 'Academic lab using two virtual machines. Windows captures keyboard events with Python and pynput, adds timestamps and local persistence, and sends the records over TCP to a Kali Linux server.',
      image: 'assets/images/projects/wap-ciberseguridad.png',
      tags: ['Python', 'TCP/IP', 'Kali Linux', 'Windows 10', 'VirtualBox', 'Ciberseguridad'],
      category: 'ciberseguridad',
      liveUrl: '/Portafolio_LEBM/assets/proyectos/actividad03/index.html',
      featured: true
    }
  ];

  get filteredProjects(): Project[] {
    const filter = this.activeFilter();
    if (filter === 'all') return this.projects;
    return this.projects.filter(project => project.category === filter);
  }

  setFilter(filter: string) {
    this.activeFilter.set(filter);

    setTimeout(() => {
      gsap.fromTo(
        '.main-projects-grid .project-glass-card',
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
      );
    }, 10);
  }

  toggleAcademic() {
    this.academicOpen.update(value => !value);

    if (this.academicOpen()) {
      setTimeout(() => {
        gsap.fromTo(
          '.academic-content .project-glass-card',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' }
        );
      }, 10);
    }
  }

  ngAfterViewInit() {
    gsap.utils.toArray<HTMLElement>('.main-projects-grid .project-glass-card').forEach((card, i) => {
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
