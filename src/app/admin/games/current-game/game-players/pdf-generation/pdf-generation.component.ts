import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pdf-generation',
  templateUrl: './pdf-generation.component.html',
  styleUrls: ['./pdf-generation.component.scss']
})
export class PdfGenerationComponent {

  @Input()tableData

}
