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
  parcial?: 'parcial-1' | 'parcial-2' | 'parcial-3' | 'final'; // Clasificación académica por parciales
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
  activeParcialFilter = signal<string>('all'); // Filtro interno de parciales
  academicOpen = signal<boolean>(false);

  // Lista principal de proyectos unificada por categorías profesionales
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

  // Tu apartado especializado de Ciberseguridad Académica dividido exactamente por tus parciales
  academicProjects: Project[] = [
    {
      id: 1,
      titleEs: 'Laboratorio de Captura y Transmisión de Eventos',
      titleEn: 'Event Capture & Transmission Cybersecurity Lab',
      descriptionEs: 'Laboratorio académico con dos máquinas virtuales. Windows captura eventos de teclado con Python y pynput, agrega marcas temporales y persistencia local, y transmite los registros por TCP hacia un servidor Kali Linux.',
      descriptionEn: 'Academic lab using two virtual machines. Windows captures keyboard events with Python and pynput, adds timestamps and local persistence, and sends the records over TCP to a Kali Linux server.',
      image: 'assets/images/projects/wap-ciberseguridad.png',
      tags: ['Python', 'TCP/IP', 'Kali Linux', 'Windows 10', 'VirtualBox', 'Ciberseguridad'],
      category: 'ciberseguridad',
      parcial: 'parcial-1', // Evaluado en el primer parcial
      liveUrl: '/Portafolio_LEBM/assets/proyectos/actividad03/index.html',
      featured: true
    },
    {
      id: 5,
      titleEs: 'INTERAFAS-LAB | Auditoría de Seguridad Web',
      titleEn: 'INTERAFAS-LAB | Web Security Assessment',
      descriptionEs: 'Laboratorio académico controlado con Docker: análisis de vulnerabilidades web, tráfico HTTP, enumeración de recursos y documentación técnica de 20 retos.',
      descriptionEn: 'Controlled Docker-based academic lab: web vulnerability analysis, HTTP traffic inspection, resource enumeration and technical documentation across 20 challenges.',
      image: '',
      tags: ['Ciberseguridad', 'Docker', 'OWASP', 'PowerShell', 'HTTP'],
      category: 'ciberseguridad',
      parcial: 'parcial-2', // Evaluado en tu segundo parcial
      liveUrl: '/Portafolio_LEBM/assets/proyectos/interafas-lab/index.html',
      featured: true
    },
    {
      id: 16,
      titleEs: 'Actividad 16. La verdad en los bits: Adquisición forense con FTK Imager',
      titleEn: 'Activity 16. Truth in Bits: Forensic Acquisition with FTK Imager',
      descriptionEs: 'Adquisición forense bit a bit de una memoria USB simulando un incidente de fraude bancario. Análisis realizado en el LIF de la UPSLP, logrando copiar 61,440,000 sectores con verificación íntegra mediante Hashes (MD5: 98b738420561b1637ab4c96ae26cbf55 | SHA-1: 84b4e52fb1724e0b4aaf9d0174994906439c59) completado en 31:03 minutos.',
      descriptionEn: 'Bit-by-bit forensic acquisition of a USB drive simulating a banking fraud incident. Analysis performed at the UPSLP LIF lab, copying 61,440,000 sectors with integrity verified via Hashes (MD5: 98b738420561b1637ab4c96ae26cbf55 | SHA-1: 84b4e52fb1724e0b4aaf9d0174994906439c59) completed in 31:03 minutes.',
      image: 'assets/images/projects/ftk-forense.png',
      tags: ['Digital Forensics', 'FTK Imager', 'Hashes Verification', 'Raw (dd)', 'Cybersecurity'],
      category: 'ciberseguridad',
      parcial: 'parcial-3', // Tu práctica real de hoy en el 3° Parcial
      liveUrl: '/Portafolio_LEBM/assets/cv/actividad-16-ftk-imager.pdf', // Tu PDF ubicado en tus recursos
      featured: true
    }
  ];

  // Getter de filtrado para los proyectos principales comerciales
  get filteredProjects(): Project[] {
    const filter = this.activeFilter();
    if (filter === 'all') return this.projects;
    return this.projects.filter(project => project.category === filter);
  }

  // Getter inteligente para filtrar las actividades escolares de Ciberseguridad por bloque/parcial
  get filteredAcademicProjects(): Project[] {
    const parcialFilter = this.activeParcialFilter();
    if (parcialFilter === 'all') return this.academicProjects;
    return this.academicProjects.filter(project => project.parcial === parcialFilter);
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

  // Permite conmutar el filtro secundario de los parciales en la UI con animaciones fluidas
  setParcialFilter(parcial: string) {
    this.activeParcialFilter.set(parcial);

    setTimeout(() => {
      gsap.fromTo(
        '.academic-content .project-glass-card',
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
