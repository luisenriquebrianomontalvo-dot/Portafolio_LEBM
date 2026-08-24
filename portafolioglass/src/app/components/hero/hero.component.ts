import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('waveCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  translate = inject(TranslateService);

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private waveMesh!: THREE.Mesh;
  private waveGeometry!: THREE.PlaneGeometry;
  private particlePoints!: THREE.Points;
  private animId!: number;
  private clock = new THREE.Clock();

  // Mouse & Scroll State
  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;
  private scrollY = 0;

  ngOnInit() {}

  ngAfterViewInit() {
    this.initWaveScene();
    this.animateEntrance();

    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('scroll', this.onScroll);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('scroll', this.onScroll);
    this.renderer?.dispose();
  }

  private initWaveScene() {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 4, 11);
    this.camera.lookAt(0, 0, 0);

    const gridX = 90;
    const gridY = 60;
    const planeWidth = 28;
    const planeHeight = 18;
    this.waveGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight, gridX, gridY);
    this.waveGeometry.rotateX(-Math.PI * 0.42);

    const waveMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      emissive: new THREE.Color(0x0071e3),
      emissiveIntensity: 0.08,
      roughness: 0.25,
      metalness: 0.1,
      transmission: 0.7,
      ior: 1.4,
      transparent: true,
      opacity: 0.7,
      wireframe: false,
      side: THREE.DoubleSide
    });

    this.waveMesh = new THREE.Mesh(this.waveGeometry, waveMaterial);
    this.waveMesh.position.set(0, -1.2, 0);
    this.scene.add(this.waveMesh);

    const posAttr = this.waveGeometry.attributes['position'];
    const pointCount = posAttr.count;
    const pointGeo = new THREE.BufferGeometry();
    const pointPositions = new Float32Array(pointCount * 3);
    const pointColors = new Float32Array(pointCount * 3);

    const cBlue = new THREE.Color('#0071e3');
    const cCyan = new THREE.Color('#00c7be');
    const cPurple = new THREE.Color('#af52de');

    for (let i = 0; i < pointCount; i++) {
      const i3 = i * 3;
      pointPositions[i3] = posAttr.getX(i);
      pointPositions[i3 + 1] = posAttr.getY(i);
      pointPositions[i3 + 2] = posAttr.getZ(i);

      const ratio = (posAttr.getX(i) + planeWidth / 2) / planeWidth;
      const mixedColor = ratio < 0.5 ? cBlue.clone().lerp(cCyan, ratio * 2) : cCyan.clone().lerp(cPurple, (ratio - 0.5) * 2);

      pointColors[i3] = mixedColor.r;
      pointColors[i3 + 1] = mixedColor.g;
      pointColors[i3 + 2] = mixedColor.b;
    }

    pointGeo.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    pointGeo.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));

    const pointMaterial = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particlePoints = new THREE.Points(pointGeo, pointMaterial);
    this.particlePoints.position.copy(this.waveMesh.position);
    this.scene.add(this.particlePoints);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x0071e3, 2.2);
    dirLight1.position.set(5, 8, 4);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00c7be, 1.8);
    dirLight2.position.set(-5, 4, 3);
    this.scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xaf52de, 2.5, 20);
    pointLight.position.set(0, 2, 5);
    this.scene.add(pointLight);

    this.animate();
  }

  private animate = () => {
    this.animId = requestAnimationFrame(this.animate);
    const time = this.clock.getElapsedTime();

    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    const posAttr = this.waveGeometry.attributes['position'];
    const pointPosAttr = this.particlePoints.geometry.attributes['position'];

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      const wave1 = Math.sin(x * 0.45 + time * 1.3) * 0.5;
      const wave2 = Math.cos(z * 0.5 + time * 1.1) * 0.45;
      const wave3 = Math.sin((x + z) * 0.3 + time * 1.7) * 0.3;
      const mouseInfluence = Math.exp(-((x - this.mouseX * 8) ** 2 + (z - this.mouseY * 4) ** 2) / 16) * 0.8;

      const y = wave1 + wave2 + wave3 + mouseInfluence;
      posAttr.setY(i, y);
      pointPosAttr.setY(i, y + 0.03);
    }

    posAttr.needsUpdate = true;
    pointPosAttr.needsUpdate = true;
    this.waveGeometry.computeVertexNormals();

    this.camera.position.x = this.mouseX * 1.2;
    this.camera.position.y = 4 + this.mouseY * 0.6;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  };

  private onMouseMove = (e: MouseEvent) => {
    this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  private onScroll = () => {
    this.scrollY = window.scrollY;
    if (this.waveMesh) {
      this.waveMesh.position.y = -1.2 - this.scrollY * 0.002;
      this.particlePoints.position.y = this.waveMesh.position.y;
    }
  };

  private onResize = () => {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private animateEntrance() {
    gsap.from('.hero-badge-wrap', { opacity: 0, y: 30, duration: 0.8, delay: 0.2, ease: 'power3.out' });
    gsap.from('.hero-title-group', { opacity: 0, y: 35, duration: 0.9, delay: 0.4, ease: 'power3.out' });
    gsap.from('.hero-actions', { opacity: 0, y: 30, duration: 0.8, delay: 0.6, ease: 'power3.out' });
    gsap.from('.hero-stats-row', { opacity: 0, y: 30, duration: 0.8, delay: 0.8, ease: 'power3.out' });
    gsap.from('.hero-right-card', { opacity: 0, scale: 0.9, duration: 1.1, delay: 0.5, ease: 'power3.out' });
  }

  scrollToProjects() {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  t(key: string) {
    return this.translate.t(key);
  }
}
