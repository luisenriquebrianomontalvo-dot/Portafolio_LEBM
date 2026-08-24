import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cursor-dot" #dot></div>
    <div class="cursor-glass-ring" #ring></div>
  `,
  styles: [`
    .cursor-dot {
      position: fixed;
      top: 0;
      left: 0;
      width: 8px;
      height: 8px;
      background: var(--accent-blue);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 12px var(--accent-blue);
      transition: background 0.2s ease, width 0.2s ease, height 0.2s ease;
    }

    .cursor-glass-ring {
      position: fixed;
      top: 0;
      left: 0;
      width: 38px;
      height: 38px;
      background: rgba(0, 113, 227, 0.08);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: 1.5px solid rgba(0, 113, 227, 0.4);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99998;
      transform: translate(-50%, -50%);
      transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                  height 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                  border-color 0.25s ease,
                  background 0.25s ease;
      box-shadow: 0 4px 15px rgba(0, 113, 227, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.8);
    }

    @media (max-width: 768px) {
      .cursor-dot, .cursor-glass-ring {
        display: none !important;
      }
    }
  `]
})
export class CursorComponent implements OnInit, OnDestroy {
  private dot!: HTMLElement;
  private ring!: HTMLElement;
  private isMobile = false;

  ngOnInit() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) return;

    this.dot = document.querySelector('.cursor-dot') as HTMLElement;
    this.ring = document.querySelector('.cursor-glass-ring') as HTMLElement;

    document.addEventListener('mousemove', this.onMove);
  }

  ngOnDestroy() {
    if (!this.isMobile) {
      document.removeEventListener('mousemove', this.onMove);
    }
  }

  private onMove = (e: MouseEvent) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    gsap.to(this.dot, { x: mouseX, y: mouseY, duration: 0.08 });
    gsap.to(this.ring, { x: mouseX, y: mouseY, duration: 0.3, ease: 'power2.out' });

    const target = e.target as HTMLElement;
    const isHoverable = target.closest('a, button, .btn, .glass-card, .skill-card-glass, .contact-tile, .segment-tab-btn');

    if (isHoverable) {
      gsap.to(this.ring, {
        scale: 1.5,
        borderColor: 'var(--accent-blue)',
        backgroundColor: 'rgba(0, 113, 227, 0.14)',
        duration: 0.2
      });
      gsap.to(this.dot, {
        scale: 0.5,
        duration: 0.2
      });
    } else {
      gsap.to(this.ring, {
        scale: 1,
        borderColor: 'rgba(0, 113, 227, 0.4)',
        backgroundColor: 'rgba(0, 113, 227, 0.08)',
        duration: 0.2
      });
      gsap.to(this.dot, {
        scale: 1,
        duration: 0.2
      });
    }
  };
}
