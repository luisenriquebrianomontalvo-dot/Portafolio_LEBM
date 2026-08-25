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
      titleEs: 'Laboratorio de Captura y Transmisión de Eventos',
      titleEn: 'Event Capture & Transmission Cybersecurity Lab',
      descriptionEs: 'Laboratorio académico con dos máquinas virtuales. Windows captura eventos de teclado con Python y pynput, agrega marcas temporales y persistencia local, y transmite los registros por TCP hacia un servidor Kali Linux.',
      descriptionEn: 'Academic lab using two virtual machines. Windows captures keyboard events with Python and pynput, adds timestamps and local persistence, and sends the records over TCP to a Kali Linux server.',
      image: '/assets/images/wap-ciberseguridad.png',
      tags: ['Python', 'TCP/IP', 'Kali Linux', 'Windows 10', 'VirtualBox', 'Ciberseguridad'],
      liveUrl:  '/Portafolio_LEBM/assets/proyectos/actividad03/index.html',
      githubUrl: '#',
      featured: true
    },
    {
      id: 2,
      titleEs: 'Levantamiento de Infraestructura CCTV',
      titleEn: 'CCTV Infrastructure Site Survey',
      descriptionEs: 'Levantamiento técnico para un proyecto de videovigilancia de gran escala, considerando más de 150 cámaras, racks, switches, cableado estructurado, charolas portacables y estimación de materiales.',
      descriptionEn: 'Technical site survey for a large-scale video surveillance project involving more than 150 cameras, racks, switches, structured cabling, cable trays, and material estimation.',
      image: '',
      tags: ['CCTV', 'Redes', 'UTP', 'Racks', 'Infraestructura'],
      featured: true
    },
    {
      id: 3,
      titleEs: 'Migración y Configuración ZKTeco / ZKTime.Net',
      titleEn: 'ZKTeco / ZKTime.Net Migration & Configuration',
      descriptionEs: 'Configuración de equipos biométricos, direccionamiento IP, respaldo de información y preparación de la migración del sistema ZKTime.Net entre equipos.',
      descriptionEn: 'Biometric device configuration, IP addressing, data backup, and preparation for migrating a ZKTime.Net system between computers.',
      image: '',
      tags: ['ZKTeco', 'ZKTime.Net', 'Redes', 'Soporte TI', 'Migración'],
      featured: true
    },
    {
      id: 4,
      titleEs: 'Soporte de Correo Corporativo y Outlook',
      titleEn: 'Corporate Email & Outlook Support',
      descriptionEs: 'Diagnóstico de conectividad POP3, administración y migración de archivos PST, configuración de cuentas y resolución de incidencias de correo corporativo.',
      descriptionEn: 'POP3 connectivity troubleshooting, PST file administration and migration, account configuration, and corporate email incident resolution.',
      image: '',
      tags: ['Outlook', 'POP3', 'PST', 'PowerShell', 'Troubleshooting']
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
