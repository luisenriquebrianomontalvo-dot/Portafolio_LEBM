import {
  Component, Input, OnDestroy, AfterViewInit,
  ElementRef, ViewChild
} from '@angular/core';

interface AmbientParticle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
  color: string;
}

@Component({
  selector: 'app-starfield',
  standalone: true,
  template: `<canvas #canvas class="ambient-particle-canvas"></canvas>`,
  styles: [`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      display: block;
      overflow: hidden;
    }
    .ambient-particle-canvas {
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  `]
})
export class StarfieldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() color1 = '#0071e3';
  @Input() color2 = '#00c7be';
  @Input() starCount = 45;

  private ctx!: CanvasRenderingContext2D;
  private particles: AmbientParticle[] = [];
  private animId!: number;
  private ro!: ResizeObserver;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize(canvas);
    this.spawnParticles(canvas);
    this.animate();

    this.ro = new ResizeObserver(() => {
      this.resize(canvas);
      this.spawnParticles(canvas);
    });
    if (canvas.parentElement) {
      this.ro.observe(canvas.parentElement);
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animId);
    this.ro?.disconnect();
  }

  private resize(canvas: HTMLCanvasElement) {
    const parent = canvas.parentElement;
    canvas.width = parent?.clientWidth || window.innerWidth;
    canvas.height = parent?.clientHeight || window.innerHeight;
  }

  private spawnParticles(canvas: HTMLCanvasElement) {
    const colors = [
      'rgba(0, 113, 227, 0.45)',
      'rgba(0, 199, 190, 0.45)',
      'rgba(175, 82, 222, 0.35)',
      'rgba(52, 199, 89, 0.35)',
      'rgba(255, 149, 0, 0.35)'
    ];

    this.particles = Array.from({ length: this.starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.8 + 1.2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.45 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.006,
      pulsePhase: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }

  private animate = () => {
    this.animId = requestAnimationFrame(this.animate);
    const canvas = this.canvasRef.nativeElement;
    const { width, height } = canvas;
    this.ctx.clearRect(0, 0, width, height);

    const t = performance.now() * 0.001;

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const alpha = p.opacity * (0.6 + 0.4 * Math.sin(t * p.pulseSpeed * 60 + p.pulsePhase));
      
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = p.radius * 6;
      this.ctx.shadowColor = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  };
}
