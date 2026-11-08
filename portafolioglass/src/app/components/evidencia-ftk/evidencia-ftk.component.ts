import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../services/translate.service';
import { StarfieldComponent } from '../starfield/starfield.component';

@Component({
  selector: 'app-evidencia-ftk',
  standalone: true,
  imports: [CommonModule, StarfieldComponent],
  templateUrl: './evidencia-ftk.component.html',
  styleUrls: ['./evidencia-ftk.component.scss']
})
export class EvidenciaFtkComponent {
  translate = inject(TranslateService);

  t(key: string) {
    return this.translate.t(key);
  }
}
