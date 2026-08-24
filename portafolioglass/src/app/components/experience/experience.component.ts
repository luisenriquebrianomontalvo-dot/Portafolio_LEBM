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
      company: 'Empresa Principal / Actual',
      roleEs: 'Desarrollador Full Stack Senior / Lead',
      roleEn: 'Senior Full Stack / Lead Developer',
      periodEs: '2023 — Actualidad',
      periodEn: '2023 — Present',
      locationEs: 'Ciudad, País (o Remoto)',
      locationEn: 'City, Country (or Remote)',
      current: true,
      bulletsEs: [
        'Liderazgo en el diseño y desarrollo de aplicaciones web escalables con frameworks modernos.',
        'Implementación de microservicios, APIs RESTful y arquitecturas en la nube.',
        'Optimización de rendimiento en frontend y backend, mejorando tiempos de carga y respuesta.',
        'Colaboración con equipos multidisciplinarios bajo metodologías ágiles (SCRUM/Kanban).'
      ],
      bulletsEn: [
        'Lead design and development of scalable web applications using modern frameworks.',
        'Implementation of microservices, RESTful APIs, and cloud architectures.',
        'Frontend and backend performance optimization, reducing latency and load times.',
        'Cross-functional collaboration with product teams under agile methodologies.'
      ],
      tags: ['Angular / React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
    },
    {
      company: 'Segunda Empresa / Startup',
      roleEs: 'Desarrollador Frontend & UI Specialist',
      roleEn: 'Frontend Developer & UI Specialist',
      periodEs: '2021 — 2023',
      periodEn: '2021 — 2023',
      locationEs: 'Ciudad, País',
      locationEn: 'City, Country',
      bulletsEs: [
        'Desarrollo de interfaces de usuario dinámicas, responsivas y accesibles.',
        'Integración con servicios backend y consumo de APIs en tiempo real.',
        'Creación y mantenimiento de librerías de componentes UI reutilizables.',
        'Implementación de pruebas unitarias y de integración para garantizar estabilidad.'
      ],
      bulletsEn: [
        'Development of dynamic, responsive, and accessible user interfaces.',
        'Integration with backend services and real-time API consumption.',
        'Creation and maintenance of reusable UI component libraries.',
        'Implementation of unit and integration tests to ensure stability.'
      ],
      tags: ['JavaScript', 'TypeScript', 'CSS3 / SCSS', 'REST APIs', 'Git']
    },
    {
      company: 'Universidad / Formación Académica',
      roleEs: 'Ingeniería en Tecnologías de la Información / Software',
      roleEn: 'Software / Information Technology Engineering',
      periodEs: '2019 — 2023',
      periodEn: '2019 — 2023',
      locationEs: 'Universidad / Institución Educativa',
      locationEn: 'University / Educational Institution',
      bulletsEs: [
        'Formación integral en algoritmos, estructuras de datos, patrones de diseño y bases de datos.',
        'Desarrollo de proyectos de software académico e investigación aplicada.',
        'Participación en hackathons y comunidades de desarrollo tecnológico.'
      ],
      bulletsEn: [
        'Comprehensive education in algorithms, data structures, design patterns, and databases.',
        'Academic software projects and applied technical research.',
        'Participation in hackathons and developer communities.'
      ],
      tags: ['Educación Superior', 'Ingeniería de Software', 'Algoritmos']
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
