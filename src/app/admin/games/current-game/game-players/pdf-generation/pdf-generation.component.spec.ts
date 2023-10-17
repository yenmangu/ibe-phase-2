import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfGenerationComponent } from './pdf-generation.component';

describe('PdfGenerationComponent', () => {
  let component: PdfGenerationComponent;
  let fixture: ComponentFixture<PdfGenerationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfGenerationComponent]
    });
    fixture = TestBed.createComponent(PdfGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
