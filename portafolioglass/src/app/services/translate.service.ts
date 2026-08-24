import { Injectable, signal } from '@angular/core';

export type Lang = 'es' | 'en';

const translations: Record<Lang, Record<string, string>> = {
  es: {
    // Navbar
    'nav.about': 'Sobre mí',
    'nav.skills': 'Habilidades',
    'nav.projects': 'Proyectos',
    'nav.experience': 'Experiencia',
    'nav.certifications': 'Certificaciones',
    'nav.contact': 'Contacto',
    // Hero
    'hero.badge': 'Disponible para nuevos proyectos',
    'hero.greeting': 'Hola, soy',
    'hero.name': 'Luis Enrique Briano Montalvo',
    'hero.title': 'Ingeniero en Tecnologias de la Información',
    'hero.subtitle': 'Soporte Técnico · Redes & Infraestructura · Ciberseguridad · Telecomunicaciones',
    'hero.location': 'México, San Luis Potosi',
    'hero.download': 'Descargar CV',
    'hero.viewProjects': 'Explorar Proyectos',
    'hero.statYears': 'Años de Experiencia',
    'hero.statProjects': 'Proyectos Realizados',
    'hero.statTech': 'Tecnologías Dominadas',
    'hero.tag1': '⚡Redes, Infraestructura & Ciberseguridad',
    'hero.tag2': 'Actualmente Trabajando',
    // About
    'about.title': 'Sobre mí',
    'about.description': 'Practicante de TI enfocado en soporte técnico, administración de redes, infraestructura física (fibra óptica y UTP) y fundamentos de ciberseguridad. Experiencia en levantamientos técnicos de campo y gestión de activos.',
    // Skills
    'skills.title': 'Stack Tecnológico',
    'skills.subtitle': 'Tecnologías, lenguajes y herramientas con las que construyo soluciones',
    'skills.all': 'Todos',
    'skills.frontend': 'Frontend',
    'skills.backend': 'Backend',
    'skills.databases': 'Bases de Datos',
    'skills.devops': 'DevOps & Cloud',
    'skills.tools': 'Herramientas & Diseño',
    // Projects
    'projects.title': 'Proyectos Destacados',
    'projects.subtitle': 'Una muestra de proyectos recientes y casos de éxito',
    'projects.live': 'Ver en vivo',
    'projects.code': 'Ver código',
    'projects.preview': 'Vista previa',
    'projects.placeholder': 'Espacio para imagen del proyecto',
    // Experience
    'experience.title': 'Experiencia Laboral',
    'experience.subtitle': 'Trayectoria profesional y proyectos destacados',
    'experience.present': 'Actualidad',
    // Certifications
    'certifications.title': 'Certificaciones & Educación',
    'certifications.subtitle': 'Títulos, certificaciones y cursos completados',
    'certifications.view': 'Ver credencial',
    // Contact
    'contact.title': 'Conectemos',
    'contact.subtitle': '¿Tienes una propuesta o quieres colaborar en un proyecto? ¡Hablemos!',
    'contact.email': 'Correo electrónico',
    'contact.emailValue': 'luisenriquebrianomontalvo@gmail.com',
    'contact.copyEmail': 'Copiar correo',
    'contact.copied': '¡Copiado!',
    'contact.linkedin': 'LinkedIn',
    'contact.linkedinValue': '/in/tu-usuario',
    'contact.github': 'GitHub',
    'contact.githubValue': '@tu-usuario',
    'contact.footer': 'Portafolio diseñado con estilo Glassmorphism Apple iOS.',
    'contact.rights': 'Todos los derechos reservados.'
  },
  en: {
    // Navbar
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.certifications': 'Certifications',
    'nav.contact': 'Contact',
    // Hero
    'hero.badge': 'Available for new opportunities',
    'hero.greeting': "Hi, I'm",
    'hero.name': 'Your Name',
    'hero.title': 'Software Engineer / Full Stack Developer',
    'hero.subtitle': 'Frontend · Backend · UI/UX Design · Cloud Architecture',
    'hero.location': 'Your City, Country',
    'hero.download': 'Download CV',
    'hero.viewProjects': 'Explore Projects',
    'hero.statYears': 'Years Experience',
    'hero.statProjects': 'Completed Projects',
    'hero.statTech': 'Mastered Technologies',
    'hero.tag1': '⚡ Web & Mobile Dev',
    'hero.tag2': 'Open to Work',
    // About
    'about.title': 'About Me',
    'about.description': 'Write a summary about your professional background, your passion for software development, and the kind of challenges you love working on.',
    // Skills
    'skills.title': 'Tech Stack',
    'skills.subtitle': 'Technologies, languages and tools I use to build solutions',
    'skills.all': 'All',
    'skills.frontend': 'Frontend',
    'skills.backend': 'Backend',
    'skills.databases': 'Databases',
    'skills.devops': 'DevOps & Cloud',
    'skills.tools': 'Tools & Design',
    // Projects
    'projects.title': 'Featured Projects',
    'projects.subtitle': 'A showcase of recent projects and achievements',
    'projects.live': 'Live Demo',
    'projects.code': 'View Code',
    'projects.preview': 'Preview',
    'projects.placeholder': 'Project Image Placeholder',
    // Experience
    'experience.title': 'Work Experience',
    'experience.subtitle': 'My professional journey and career highlights',
    'experience.present': 'Present',
    // Certifications
    'certifications.title': 'Certifications & Education',
    'certifications.subtitle': 'Degrees, professional certifications and achievements',
    'certifications.view': 'View credential',
    // Contact
    'contact.title': "Let's Connect",
    'contact.subtitle': 'Have a project in mind or want to collaborate? Let’s talk!',
    'contact.email': 'Email Address',
    'contact.emailValue': 'youremail@example.com',
    'contact.copyEmail': 'Copy email',
    'contact.copied': 'Copied!',
    'contact.linkedin': 'LinkedIn',
    'contact.linkedinValue': '/in/your-username',
    'contact.github': 'GitHub',
    'contact.githubValue': '@your-username',
    'contact.footer': 'Portfolio designed with Apple iOS Glassmorphism aesthetic.',
    'contact.rights': 'All rights reserved.'
  }
};

@Injectable({ providedIn: 'root' })
export class TranslateService {
  lang = signal<Lang>('es');

  constructor() {
    const saved = localStorage.getItem('lang') as Lang;
    if (saved === 'es' || saved === 'en') this.lang.set(saved);
  }

  toggle() {
    this.lang.update(l => (l === 'es' ? 'en' : 'es'));
    localStorage.setItem('lang', this.lang());
  }

  t(key: string): string {
    return translations[this.lang()][key] ?? key;
  }
}
