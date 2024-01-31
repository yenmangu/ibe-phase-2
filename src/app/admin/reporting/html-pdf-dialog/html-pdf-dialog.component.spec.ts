import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlPdfDialogComponent } from './html-pdf-dialog.component';

describe('HtmlPdfDialogComponent', () => {
  let component: HtmlPdfDialogComponent;
  let fixture: ComponentFixture<HtmlPdfDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HtmlPdfDialogComponent]
    });
    fixture = TestBed.createComponent(HtmlPdfDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
