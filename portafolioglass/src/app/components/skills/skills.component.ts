import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../services/translate.service';
import { StarfieldComponent } from '../starfield/starfield.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  icon: string;
  category: string;
}

interface SkillCategory {
  id: string;
  labelKey: string;
  icon: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, StarfieldComponent],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements AfterViewInit {
  translate = inject(TranslateService);
  activeTab = signal<string>('all');

  categories: SkillCategory[] = [
    { id: 'all',       labelKey: 'skills.all',       icon: '✨' },
    { id: 'frontend',  labelKey: 'skills.frontend',  icon: '💻' },
    { id: 'backend',   labelKey: 'skills.backend',   icon: '⚙️' },
    { id: 'databases', labelKey: 'skills.databases', icon: '🗄️' },
    { id: 'devops',    labelKey: 'skills.devops',    icon: '🚀' },
    { id: 'tools',     labelKey: 'skills.tools',     icon: '🛠️' },
  ];

  allSkills: Skill[] = [
    // Frontend
    { name: 'Angular / React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg', category: 'frontend' },
    { name: 'TypeScript',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', category: 'frontend' },
    { name: 'JavaScript',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', category: 'frontend' },
    { name: 'HTML5 / CSS3',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', category: 'frontend' },
    { name: 'Tailwind / SCSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', category: 'frontend' },

    // Backend
    { name: 'Node.js / Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', category: 'backend' },
    { name: 'Java / Spring',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', category: 'backend' },
    { name: 'Python',            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', category: 'backend' },
    { name: 'C# / .NET',         icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg', category: 'backend' },

    // Databases
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', category: 'databases' },
    { name: 'MySQL',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', category: 'databases' },
    { name: 'MongoDB',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', category: 'databases' },

    // DevOps
    { name: 'Git & GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', category: 'devops' },
    { name: 'Docker',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', category: 'devops' },
    { name: 'AWS / Cloud',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', category: 'devops' },

    // Tools
    { name: 'Figma',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', category: 'tools' },
    { name: 'VS Code',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', category: 'tools' },
    { name: 'Postman',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg', category: 'tools' },
  ];

  get filteredSkills(): Skill[] {
    const tab = this.activeTab();
    if (tab === 'all') return this.allSkills;
    return this.allSkills.filter(s => s.category === tab);
  }

  setTab(tabId: string) {
    this.activeTab.set(tabId);
    setTimeout(() => {
      gsap.fromTo('.skill-card-glass', 
        { opacity: 0, scale: 0.92, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, stagger: 0.03, ease: 'power2.out' }
      );
    }, 10);
  }

  ngAfterViewInit() {
    gsap.fromTo('.skills-segment-wrapper',
      { opacity: 0, y: 25 },
      {
        scrollTrigger: { trigger: '.skills-segment-wrapper', start: 'top 90%' },
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out'
      }
    );

    gsap.fromTo('.skill-card-glass',
      { opacity: 0, y: 30 },
      {
        scrollTrigger: { trigger: '.skills-grid', start: 'top 90%' },
        opacity: 1,
        y: 0,
        stagger: 0.03,
        duration: 0.5,
        ease: 'power2.out'
      }
    );
  }

  t(key: string) {
    return this.translate.t(key);
  }
}
