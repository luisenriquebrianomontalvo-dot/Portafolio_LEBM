import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../services/translate.service';
import { StarfieldComponent } from '../starfield/starfield.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Job {
  company: string;
  roleEs: string;
  roleEn: string;
  periodEs: string;
  periodEn: string;
  locationEs: string;
  locationEn: string;
  bulletsEs: string[];
  bulletsEn: string[];
  tags: string[];
  current?: boolean;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, StarfieldComponent],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements AfterViewInit {
  translate = inject(TranslateService);

  jobs: Job[] = [
    {
      company: 'LEIVO',
      roleEs: 'Practicante de Tecnologías de la Información',
      roleEn: 'Information Technology Intern',
      periodEs: '2026 — Actualidad',
      periodEn: '2026 — Present',
      locationEs: 'San Luis Potosí, México',
      locationEn: 'San Luis Potosí, Mexico',
      current: true,
      bulletsEs: [
        'Soporte técnico a usuarios, equipos de cómputo, impresoras y correo corporativo.',
        'Participación en levantamientos de redes, racks, cableado estructurado, fibra óptica y proyectos CCTV.',
        'Configuración y migración de sistemas ZKTeco/ZKTime.Net y equipos de control de acceso.',
        'Diagnóstico de conectividad, direccionamiento IP, servicios de red y troubleshooting en Windows y Linux.'
      ],
      bulletsEn: [
        'Technical support for users, computers, printers, and corporate email.',
        'Participation in network, rack, structured cabling, fiber-optic, and CCTV site surveys.',
        'Configuration and migration of ZKTeco/ZKTime.Net and access-control systems.',
        'Connectivity, IP addressing, network service, Windows, and Linux troubleshooting.'
      ],
      tags: ['Soporte TI', 'Redes', 'CCTV', 'ZKTeco', 'Windows', 'Linux']
    },
    {
      company: 'Plaza de la Tecnología',
      roleEs: 'Técnico de Soporte',
      roleEn: 'Technical Support Technician',
      periodEs: 'Experiencia previa',
      periodEn: 'Previous experience',
      locationEs: 'San Luis Potosí, México',
      locationEn: 'San Luis Potosí, Mexico',
      bulletsEs: [
        'Diagnóstico, mantenimiento y soporte de equipos de cómputo.',
        'Instalación de sistemas operativos, software y componentes de hardware.',
        'Atención y resolución de incidencias técnicas para usuarios.'
      ],
      bulletsEn: [
        'Computer diagnostics, maintenance, and technical support.',
        'Operating system, software, and hardware component installation.',
        'User assistance and resolution of technical incidents.'
      ],
      tags: ['Hardware', 'Windows', 'Soporte Técnico', 'Mantenimiento']
    },
    {
      company: 'ZARA',
      roleEs: 'Operaciones',
      roleEn: 'Operations',
      periodEs: 'Ago 2021 — Dic 2024',
      periodEn: 'Aug 2021 — Dec 2024',
      locationEs: 'San Luis Potosí, México',
      locationEn: 'San Luis Potosí, Mexico',
      bulletsEs: [
        'Experiencia en operación, organización, atención al cliente y trabajo en equipo.',
        'Cumplimiento de procesos y actividades en un entorno de trabajo dinámico.'
      ],
      bulletsEn: [
        'Experience in operations, organization, customer service, and teamwork.',
        'Process execution and task management in a fast-paced work environment.'
      ],
      tags: ['Operaciones', 'Atención al Cliente', 'Trabajo en Equipo']
    }
  ];

  ngAfterViewInit() {
    gsap.utils.toArray<HTMLElement>('.timeline-card').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 85%' },
        opacity: 0,
        y: 40,
        duration: 0.7,
        delay: i * 0.1,
        ease: 'power3.out'
      });
    });
  }

  period(job: Job) {
    return this.translate.lang() === 'es' ? job.periodEs : job.periodEn;
  }

  bullets(job: Job) {
    return this.translate.lang() === 'es' ? job.bulletsEs : job.bulletsEn;
  }

  role(job: Job) {
    return this.translate.lang() === 'es' ? job.roleEs : job.roleEn;
  }

  location(job: Job) {
    return this.translate.lang() === 'es' ? job.locationEs : job.locationEn;
  }

  t(key: string) {
    return this.translate.t(key);
  }
}
