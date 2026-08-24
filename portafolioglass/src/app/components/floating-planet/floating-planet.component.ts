import {
  Component, OnDestroy, AfterViewInit, ElementRef, ViewChild
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionConfig {
  x: number;
  y: number;
  scale: number;
  mobileX: number;
  mobileY: number;
  mobileScale: number;
}

@Component({
  selector: 'app-floating-planet',
  standalone: true,
  template: `<canvas #planetCanvas class="planet-canvas"></canvas>`,
  styles: [`
    .planet-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
      opacity: 0.92;
    }
    @media (max-width: 768px) {
      .planet-canvas { opacity: 0.75; }
    }
  `]
})
export class FloatingPlanetComponent implements AfterViewInit, OnDestroy {
  @ViewChild('planetCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private model!: THREE.Group;
  private mixer!: THREE.AnimationMixer;
  private clock = new THREE.Clock();
  private animId!: number;
  private frameSkip = 0;

  private get isMobile() {
    return window.innerWidth <= 768;
  }

  private readonly sections: SectionConfig[] = [
    { x: 3.2,  y: -0.3, scale: 1.35, mobileX: 1.05,  mobileY: 0.0, mobileScale: 0.75 },
    { x: -3.3, y: 0.2,  scale: 1.1,  mobileX: -1.05, mobileY: 0.0, mobileScale: 0.70 },
    { x: 3.2,  y: -0.5, scale: 1.25, mobileX: 1.05,  mobileY: 0.0, mobileScale: 0.72 },
    { x: -3.1, y: 0.3,  scale: 1.05, mobileX: -1.05, mobileY: 0.0, mobileScale: 0.68 },
    { x: 3.0,  y: -0.2, scale: 1.15, mobileX: 1.05,  mobileY: 0.0, mobileScale: 0.70 },
  ];

  ngAfterViewInit() {
    this.initThree();
    this.loadAstronaut();
    this.setupScrollAnimation();
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animId);
    this.renderer?.dispose();
    window.removeEventListener('resize', this.onResize);
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;
    const mobile = this.isMobile;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !mobile,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(mobile ? 1 : Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    // Apple Light Theme Studio Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    const key = new THREE.DirectionalLight(0xfff8ee, 2.2);
    key.position.set(4, 6, 5);
    const fill = new THREE.PointLight(0x0071e3, 1.2);
    fill.position.set(-4, 0, 2);
    const rim = new THREE.PointLight(0x00c7be, 0.9);
    rim.position.set(0, 4, -3);

    this.scene.add(ambient, key, fill, rim);
  }

  private loadAstronaut() {
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/cute_astronaut.glb',
      gltf => {
        this.model = gltf.scene;

        // Auto-center model
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        this.model.position.sub(center);

        // Initial coordinates
        const cfg = this.sections[0];
        const m = this.isMobile;
        this.model.scale.setScalar(m ? cfg.mobileScale : cfg.scale);
        this.model.position.x = m ? cfg.mobileX : cfg.x;
        this.model.position.y = m ? cfg.mobileY : cfg.y;

        this.scene.add(this.model);

        // Setup AnimationMixer
        if (gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(this.model);
          gltf.animations.forEach(clip => {
            const action = this.mixer.clipAction(clip);
            action.play();
          });
        }

        this.animate();
      },
      undefined,
      err => {
        console.warn('Astronaut model could not be loaded:', err);
      }
    );
  }

  private setupScrollAnimation() {
    const sectionIds = ['hero', 'skills', 'projects', 'experience', 'certifications'];

    sectionIds.forEach((id, i) => {
      const cfg = this.sections[i];
      const doAnim = () => {
        if (!this.model) return;
        const m = this.isMobile;
        const dur = m ? 1.2 : 1.6;

        gsap.to(this.model.position, {
          x: m ? cfg.mobileX : cfg.x,
          y: m ? cfg.mobileY : cfg.y,
          duration: dur,
          ease: 'power2.inOut',
          overwrite: 'auto'
        });

        gsap.to(this.model.scale, {
          x: m ? cfg.mobileScale : cfg.scale,
          y: m ? cfg.mobileScale : cfg.scale,
          z: m ? cfg.mobileScale : cfg.scale,
          duration: dur,
          ease: 'power2.inOut',
          overwrite: 'auto'
        });
      };

      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top center',
        onEnter: doAnim,
        onEnterBack: doAnim,
        fastScrollEnd: true
      });
    });
  }

  private animate = () => {
    this.animId = requestAnimationFrame(this.animate);

    if (this.isMobile) {
      this.frameSkip ^= 1;
      if (this.frameSkip) return;
    }

    const delta = this.clock.getDelta();

    if (this.mixer) this.mixer.update(delta);
    if (this.model) this.model.rotation.y += 0.0035;

    this.renderer.render(this.scene, this.camera);
  };

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
}
