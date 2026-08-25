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
    { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', category: 'frontend' },
    { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', category: 'frontend' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', category: 'frontend' },

    // Backend / Programación
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', category: 'backend' },
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', category: 'backend' },
    { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', category: 'backend' },
    { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg', category: 'backend' },

    // Bases de datos
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', category: 'databases' },

    // Sistemas / Infraestructura
    { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', category: 'devops' },
    { name: 'Windows', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows11/windows11-original.svg', category: 'devops' },
    { name: 'Git & GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', category: 'devops' },

    // Herramientas
    { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', category: 'tools' },
    { name: 'VirtualBox', icon: 'assets/icons/virtualbox.png', category: 'tools' },
    { name: 'Cisco Packet Tracer', icon: 'assets/icons/cisco-packet-tracer.png', category: 'tools' },
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
